/** @format */

// deno-lint-ignore-file no-var
/** @format */

import * as fs from "https://deno.land/std@0.192.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.192.0/path/mod.ts";
import { contentType } from "https://deno.land/std@0.192.0/media_types/mod.ts";
import { createHash } from "node:crypto";
import { LRU } from "https://deno.land/x/lru@1.0.2/mod.ts";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.8.1/mod.ts";
import { RequireSecret } from "./app/Helpers/Secrets.ts";
import { createRequestHandlerWithStaticFiles } from "https://esm.sh/@remix-run/deno@1.18.1";
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import * as build from "./remix.gen.ts";
import {
	esbuild,
	ensureEsbuildInitialized,
	type esbuildWasm,
} from "./esbuild.ts";
import NoTrailing from "./Middlewares/noTrailing.ts";
import { SendLog } from "~/models/Logging.server.ts";
import { load } from "https://deno.land/std@0.192.0/dotenv/mod.ts";
import { DataFunctionArgs, ServerBuild } from "@remix-run/server-runtime";

await load();
interface CommonOptions {
	port?: number;
	appDirectory?: string;
	staticDirectory?: string;
	assetsDirectory?: string;
	generatedFile?: string;
	manifest?: ServerBuild;
	getLoadContext?: (request: Request) => Promise<any>;
}

interface CreateRequestHandlerArgs extends CommonOptions {
	generatedFile?: string;
	mode?: "production" | "development";
}

declare global {
	var APP_URL: string;
	var LOG_URL: string;
}

window.APP_URL = RequireSecret("APP_URL");
window.LOG_URL = RequireSecret("LOG_URL");

export async function createRequestHandler({
	appDirectory = path.resolve(Deno.cwd(), "app"),
	assetsDirectory = path.resolve(Deno.cwd(), "assets"),
	generatedFile = path.resolve(Deno.cwd(), "remix.gen.ts"),
	staticDirectory = path.resolve(Deno.cwd(), "public"),
	manifest,
	mode = "production",
	getLoadContext,
}: CreateRequestHandlerArgs) {
	appDirectory = path.resolve(appDirectory);
	staticDirectory = path.resolve(staticDirectory);
	generatedFile = path.resolve(generatedFile);
	const runtime = createRuntime({
		appDirectory,
		assetsDirectory,
		manifest,
		generatedFile,
		mode,
	});

	await runtime
		.loadBuild()
		.then(() =>
			runtime.checksum
				? runtime.ensureCompilation({ checksum: runtime.checksum })
				: void 0
		);
	return createRequestHandlerWithStaticFiles({
		build: await runtime.loadBuild(),
		mode,
		getLoadContext,
	});
}

function createRuntime({
	appDirectory,
	assetsDirectory,
	mode,
	generatedFile,
	manifest,
}: {
	appDirectory: string;
	assetsDirectory?: string;
	mode: "production" | "development";
	generatedFile?: string;
	manifest?: ServerBuild;
}) {
	appDirectory = path.resolve(appDirectory);
	assetsDirectory = assetsDirectory
		? path.resolve(assetsDirectory)
		: undefined;
	generatedFile = generatedFile ? path.resolve(generatedFile) : undefined;
	const assetsLRU = new LRU<string>(500);

	let lastBuildChecksum: string | undefined;
	let lastBuild: ServerBuild | undefined;
	let lastBuildTime = 0;
	let lastClientBuildTime = 0;
	let lastModifiedTime = 0;
	let lastRoutes: Map<string, string> | undefined;
	let compilationPromise: Promise<
		esbuildWasm.BuildResult & {
			outputFiles: esbuildWasm.OutputFile[];
		}
	>;

	if (mode === "development") {
		(async () => {
			const watcher = Deno.watchFs(appDirectory, {
				recursive: true,
			});
			for await (const event of watcher) {
				if (["create", "modify", "remove"].includes(event.kind)) {
					lastModifiedTime = Date.now();
				}
			}
		})();
	}

	const loadBuild = async (): Promise<any> => {
		const timestamp = Date.now();
		if (
			(mode === "production" || lastModifiedTime <= lastBuildTime) &&
			lastBuild
		) {
			return lastBuild;
		}

		const checksum = buildChecksum({ appDirectory, assetsDirectory });

		if (mode === "production") {
			const newBuild =
				(manifest
					? createBuildFromManifest(checksum, manifest)
					: undefined) || (await import(generatedFile!));
			lastBuildTime = timestamp;
			lastBuild = newBuild;
			lastRoutes = new Map(
				Object.values(
					newBuild.routes as Record<
						string,
						{ file: string; id: string }
					>
				).map(r => [
					path.resolve(path.dirname(generatedFile!), r.file),
					r.id,
				])
			);

			return newBuild;
		}

		const routes = await loadRoutes(appDirectory);

		await writeGeneratedFile({
			appDirectory,
			generatedFile: generatedFile!,
			routes,
			checksum,
		});

		const initializationTasks: Promise<unknown>[] = [];

		const routeModules = new Map<string, Record<string, unknown>>();
		const newBuild: any = {
			entry: {
				module: await import(
					path.resolve(appDirectory, "entry.server.tsx") +
						"?ts=" +
						timestamp
				),
			},
			routes: Object.values(routes).reduce((acc, route) => {
				let routeModule: Record<string, unknown> | undefined =
					undefined;
				let ensurePromise: Promise<unknown>;
				const ensureRouteModule = async () => {
					if (ensurePromise) return ensurePromise;
					if (typeof routeModule !== "undefined") return;
					routeModule = await import(
						route.file.replace("file://", "") + "?ts=" + timestamp
					);
					routeModules.set(route.id, routeModule!);
				};
				initializationTasks.push((ensurePromise = ensureRouteModule()));

				return {
					...acc,
					[route.id]: {
						id: route.id,
						path: route.path,
						index: route.index,
						parentId: route.parentId,
						module: {
							action: async (args: DataFunctionArgs) => {
								await ensureRouteModule();
								return (
									(
										routeModule!.action as (
											args: DataFunctionArgs
										) => unknown
									)?.(args) || null
								);
							},
							loader: async (args: DataFunctionArgs) => {
								await ensureRouteModule();
								return (
									(
										routeModule!.loader as (
											args: DataFunctionArgs
										) => unknown
									)?.(args) || null
								);
							},
							get CatchBoundary() {
								return routeModule!.CatchBoundary;
							},
							get default() {
								return routeModule!.default;
							},
							get ErrorBoundary() {
								return routeModule!.ErrorBoundary;
							},
							get handle() {
								return routeModule!.handle;
							},
							get headers() {
								return routeModule!.headers;
							},
							get links() {
								return routeModule!.links;
							},
							get meta() {
								return routeModule!.meta;
							},
						},
					},
				} as ServerBuild["routes"];
			}, {} as ServerBuild["routes"]),
			publicPath: `/${checksum}/`,
			assetsBuildDirectory: "",
			assets: {
				entry: { imports: [], module: `/${checksum}/entry.client.js` },
				routes: Object.values(routes).reduce((acc, route) => {
					return {
						...acc,
						[route.id]: {
							id: route.id,
							path: route.path,
							index: route.index,
							parentId: route.parentId,
							imports: [],
							module: `/${checksum}/${route.id}.js`,
							get hasAction() {
								return !!routeModules.get(route.id)!.action;
							},
							get hasLoader() {
								return !!routeModules.get(route.id)!.loader;
							},
							get hasCatchBoundary() {
								return !!routeModules.get(route.id)!
									.CatchBoundary;
							},
							get hasErrorBoundary() {
								return !!routeModules.get(route.id)!
									.ErrorBoundary;
							},
						},
					};
				}, {}),
				url: `/${checksum}/manifest.js`,
				version: checksum,
			},
			future: {
				v2_errorBoundary: true,
				v2_headers: true,
				v2_meta: true,
				v2_normalizeFormMethod: true,
				v2_routeConvention: true,
				v2_dev: true,
			},
		};

		await Promise.all(initializationTasks);

		if (timestamp > lastBuildTime) {
			lastBuildTime = timestamp;
			lastBuild = newBuild;
			lastBuildChecksum = checksum;
			lastRoutes = new Map(
				Object.values(routes).map(r => [r.file, r.id])
			);
		}

		return newBuild;
	};

	function createBuildFromManifest(checksum: string, manifest: ServerBuild) {
		const build = manifest;
		return {
			entry: build.entry,
			routes: build.routes,
			publicPath: `/${checksum}/`,
			assetsBuildDirectory: "",
			assets: {
				...build.assets,
				url: `/${checksum}/manifest.js`,
				version: checksum,
				entry: {
					imports: [],
					module: `/${checksum}${build.assets.entry.module}`,
				},
				routes: Object.values(build.assets.routes).reduce(
					(acc, route) => {
						return {
							...acc,
							[route.id]: {
								...route,
								module: `/${checksum}${route.module}`,
							},
						};
					},
					{}
				),
			},
			future: build.future,
		};
	}

	async function ensureCompilation({ checksum }: { checksum: string }) {
		checksum = checksum || buildChecksum({ appDirectory, assetsDirectory });
		const getPlugins = () => {
			const browserRouteModulesPlugin = {
				name: "browser-route-modules",
				setup(build: esbuildWasm.PluginBuild) {
					build.onResolve({ filter: /\?route$/ }, args => {
						const file = args.path.replace(/\?route$/, "");
						if (lastRoutes!.has(file)) {
							return {
								path: file,
								namespace: "browser-route-modules",
								sideEffects: false,
								pluginData: { file },
							};
						}
						return undefined;
					});
					build.onLoad(
						{ filter: /.*/, namespace: "browser-route-modules" },
						async args => {
							let file = args.pluginData.file;
							if (file) {
								await ensureEsbuildInitialized();
								file = file.replace("file://", "");
								const result = await esbuild.build({
									absWorkingDir: Deno.cwd(),
									minify: mode === "production",
									treeShaking: true,
									logLevel: "silent",
									entryPoints: {
										route: file,
									},
									write: false,
									outdir: `.`,
									bundle: true,
									splitting: true,
									format: "esm",
									publicPath: `/${checksum}/`,
									metafile: true,
									jsx: "automatic",
									jsxImportSource: "react",
									plugins: [
										{
											name: "externals",
											setup(build) {
												build.onResolve(
													{ filter: /.*/ },
													args => {
														if (
															args.path !== file
														) {
															return {
																path: args.path,
																external: true,
															};
														}
														return undefined;
													}
												);
											},
										},
										...denoPlugins({
											importMapURL: `file://${Deno.cwd()}/import-map.json`,
										}),
									],
								});

								const meta = Object.values(
									result.metafile?.outputs || {}
								)[0];

								if (meta) {
									const theExports = meta.exports.filter(
										ex => !!browserSafeRouteExports[ex]
									);

									let contents = "module.exports = {};";
									if (theExports.length !== 0) {
										const spec = `{ ${theExports.join(
											", "
										)} }`;
										contents = `export ${spec} from ${JSON.stringify(
											`file://${file}`
										)};`;
									}

									return {
										contents,
										resolveDir: appDirectory,
										loader: "ts",
									};
								}
							}
							return undefined;
						}
					);
				},
			};

			return [
				{
					name: "remix-env",
					setup(build: esbuildWasm.PluginBuild) {
						build.onResolve({ filter: /.*/ }, args => {
							if (
								args.path.startsWith("https://deno.land/std") &&
								args.path.endsWith("/node/process.ts")
							) {
								return {
									path: args.path,
									sideEffects: false,
									namespace: "remix-env",
								};
							}
						});
						build.onLoad(
							{ filter: /.*/, namespace: "remix-env" },
							() => {
								return {
									contents: `export default { env: ${JSON.stringify(
										{
											REMIX_DEV_SERVER_WS_PORT:
												window.location?.port || null,
										}
									)} };`,
								};
							}
						);
					},
				},
				{
					name: "exclude-deno",
					setup(build: esbuildWasm.PluginBuild) {
						build.onResolve({ filter: /.*/ }, args => {
							if (
								args.path === "@remix-run/deno" ||
								args.resolveDir.match(/@remix-run\/deno/) ||
								args.path.startsWith("https://deno.land/std")
							) {
								return {
									path: args.path,
									external: true,
									sideEffects: false,
								};
							}
						});
					},
				},
				browserRouteModulesPlugin,
				...denoPlugins({
					importMapURL: `file://${Deno.cwd()}/import-map.json`,
				}),
			];
		};

		if (!compilationPromise || lastModifiedTime > lastClientBuildTime) {
			lastClientBuildTime = Date.now();
			const getEntryPoints = async () => {
				const entry = await findFileWithExt(
					path.resolve(appDirectory, "entry.client"),
					[".tsx", ".ts"]
				);
				const entryPoints: Record<string, string> = entry
					? {
							"entry.client": entry,
					  }
					: {};
				return { entryPoints };
			};

			const minifyOptions =
				mode === "development"
					? {
							minifyIdentifiers: false,
							minifySyntax: true,
							minifyWhitespace: true,
					  }
					: { minify: true };

			compilationPromise = Promise.all([
				getEntryPoints(),
				//ensureEsbuildInitialized(),
			]).then(([{ entryPoints }]) =>
				esbuild.build({
					absWorkingDir: Deno.cwd(),
					entryPoints: {
						...entryPoints,
						...[...lastRoutes!.entries()].reduce(
							(acc, [file, routeId]) => ({
								...acc,
								[routeId]: file + "?route",
							}),
							{}
						),
					},
					...minifyOptions,
					treeShaking: true,
					outdir: `.`,
					write: false,
					bundle: true,
					splitting: true,
					format: "esm",
					jsx: "automatic",
					jsxImportSource: "react",
					publicPath: `/${checksum}/`,
					logLevel: "info",
					color: mode === "development",
					plugins: getPlugins(),
					metafile: true,
					define: {
						__BROWSER_BUILD__: "true",
					},
				})
			);

			const buildResult = await compilationPromise;
			const cwdLen = Deno.cwd().length;
			for (const output of buildResult.outputFiles || []) {
				assetsLRU.set(
					"/" + checksum + output.path.slice(cwdLen),
					output.text
				);
			}
		}

		await compilationPromise;
	}

	return {
		ensureCompilation,
		loadBuild,
		get checksum(): string | undefined {
			return lastBuildChecksum;
		},
		async serveAssets(url: URL): Promise<Response | undefined> {
			if (!url.pathname.startsWith(`/${lastBuildChecksum}/`)) {
				return undefined;
			}
			const checksum = lastBuildChecksum!;

			const contentTypeHeader = contentType(
				url.pathname.split(".").slice(-1)[0]
			);
			if (assetsLRU.has(url.pathname)) {
				return new Response(assetsLRU.get(url.pathname), {
					headers: contentTypeHeader
						? {
								"Content-Type": contentTypeHeader,
								"Cache-Control":
									"public, max-age=31536000, immutable",
						  }
						: undefined,
				});
			}

			if (url.pathname.endsWith(`/${checksum}/manifest.js`)) {
				return new Response(
					`window.__remixManifest=${JSON.stringify(
						lastBuild!.assets
					)};`,
					{
						headers: contentTypeHeader
							? {
									"Content-Type": contentTypeHeader,
									"Cache-Control":
										"public, max-age=31536000, immutable",
							  }
							: undefined,
					}
				);
			}

			await ensureCompilation({ checksum });

			const file = assetsLRU.get(url.pathname);
			if (file) {
				return new Response(file, {
					headers: contentTypeHeader
						? {
								"Content-Type": contentTypeHeader,
								"Cache-Control":
									"public, max-age=31536000, immutable",
						  }
						: undefined,
				});
			}

			return undefined;
		},
	};
}

export async function loadRoutes(appDirectory: string) {
	const routes: Record<
		string,
		{
			id: string;
			parentId?: string;
			file: string;
			path?: string;
			index?: boolean;
		}
	> = {
		root: {
			id: "root",
			file: path.resolve(appDirectory, "root.tsx"),
		},
	};

	try {
		const routesDir = path.resolve(appDirectory, "routes");
		let entries: {
			id: string;
			index?: boolean;
			path?: string;
			file: string;
		}[] = [];
		for await (const entry of fs.walk(routesDir, { maxDepth: 1 })) {
			if (
				!entry.isFile ||
				!(entry.path.endsWith(".ts") || entry.path.endsWith(".tsx"))
			) {
				continue;
			}
			let rel_path = path.relative(routesDir, entry.path);
			rel_path = rel_path.replace(/\\/g, "/");
			//const normalizedSystemSlashes = relativePath.replace(/\\/g, "/");
			const withoutExtension = rel_path.replace(/\.tsx?$/, "");
			const withSlashes = withoutExtension.replace(/\./g, "/");
			const index =
				withoutExtension === "_index" || withSlashes.endsWith("/index");
			const withoutIndex = index
				? withSlashes.replace(/_?\/?index$/, "")
				: withSlashes;
			const withOptionalSlug = withoutIndex
				.replace(/\(/g, "")
				.replace(/\)/g, "?");
			const withSlugs = withOptionalSlug.replace(/\$/g, ":");
			const fullPath = withSlugs
				.split("/")
				.map(segment => segment.replace(/_$/, ""))
				.join("/");
			entries.push({
				id: "routes/" + withoutExtension.replace(/\./g, "/"),
				index,
				path: fullPath,
				file: entry.path,
			});
		}
		entries = entries.sort((a, b) => b.file.length - a.file.length);

		const findParentId = (id: string) => {
			if (id === "root") return undefined;

			let foundId: string | undefined = undefined;
			for (const entry of entries) {
				if (entry.id === id) continue;
				if (id.startsWith(entry.id + "/")) {
					foundId = entry.id;
				}
			}
			return foundId || "root";
		};

		for (const entry of entries) {
			routes[entry.id] = {
				...entry,
				parentId: findParentId(entry.id),
			};
		}
	} catch {
		// do nothing
	}
	function cleanUpPath(route: { parentId?: string; path?: string }) {
		if (route.parentId && route.path && routes[route.parentId].path) {
			route.path = route.path.slice(
				routes[route.parentId].path!.length + 1
			);
		}
	}

	for (const route of Object.values(routes)) {
		cleanUpPath(route);
	}
	return routes;
}

export function buildChecksum({
	appDirectory,
	assetsDirectory,
}: {
	appDirectory: string;
	assetsDirectory?: string;
}) {
	const deploymentId = Deno.env.toObject()["DENO_DEPLOYMENT_ID"];
	if (deploymentId) return deploymentId;

	const hash = createHash("md5");

	for (const entry of fs.walkSync(appDirectory)) {
		if (!entry.isFile) {
			continue;
		}
		const file = Deno.readFileSync(entry.path);
		hash.update(file);
	}

	if (assetsDirectory) {
		for (const entry of fs.walkSync(assetsDirectory)) {
			if (!entry.isFile) {
				continue;
			}
			const file = Deno.readFileSync(entry.path);
			hash.update(file);
		}
	}
	return hash.digest("base64");
}

async function findFileWithExt(baseName: string, exts: string[]) {
	for (const ext of exts) {
		const fileName = baseName + ext;
		try {
			const stat = await Deno.stat(fileName);
			if (stat.isFile) {
				return fileName;
			}
		} catch {
			// do nothing
		}
	}
	return undefined;
}

const browserSafeRouteExports: { [name: string]: boolean } = {
	CatchBoundary: true,
	ErrorBoundary: true,
	default: true,
	handle: true,
	links: true,
	meta: true,
	shouldRevalidate: true,
};

export async function writeGeneratedFile({
	generatedFile,
	appDirectory,
	routes,
}: {
	generatedFile: string;
	appDirectory: string;
	routes: Record<
		string,
		{
			id: string;
			parentId?: string | undefined;
			file: string;
			path?: string | undefined;
			index?: boolean | undefined;
		}
	>;
	checksum: string;
}) {
	const serverEntry =
		"./" +
		path
			.relative(
				path.dirname(generatedFile),
				path.resolve(appDirectory, "entry.server.tsx")
			)
			.replace(/\\/g, "/");

	const routeImports = Object.values(routes)
		.map(
			(route, index) =>
				`import * as route${index} from ${JSON.stringify(
					"./" +
						path.relative(
							path.dirname(generatedFile),
							path
								.resolve(route.file.replace("file://", ""))
								.replace(/\\/g, "/")
						)
				)};`
		)
		.join("\n");

	const routesObject =
		"{\n" +
		Object.values(routes)
			.map(
				(route, index) =>
					`\t${JSON.stringify(route.id)}: {\n` +
					`\t\tid: ${JSON.stringify(route.id)},\n` +
					(route.path
						? `\t\tpath: ${JSON.stringify(route.path)},\n`
						: "") +
					(route.index
						? `\t\tindex: ${JSON.stringify(route.index)},\n`
						: "") +
					(route.parentId
						? `\t\tparentId: ${JSON.stringify(route.parentId)},\n`
						: "") +
					`\t\tmodule: route${index},\n` +
					`\t\tfile: ${JSON.stringify(
						"./" +
							path
								.relative(
									path.dirname(generatedFile),
									route.file
								)
								.replace(/\\/g, "/")
					)},\n` +
					"\t},"
			)
			.join("\n") +
		"\n}";

	const assetRoutes =
		"{\n" +
		Object.values(routes)
			.map(
				(route, index) =>
					`\t\t${JSON.stringify(route.id)}: {\n` +
					`\t\t\tid: ${JSON.stringify(route.id)},\n` +
					(route.path
						? `\t\t\tpath: ${JSON.stringify(route.path)},\n`
						: "") +
					(route.index
						? `\t\t\tindex: ${JSON.stringify(route.index)},\n`
						: "") +
					(route.parentId
						? `\t\t\tparentId: ${JSON.stringify(route.parentId)},\n`
						: "") +
					`\t\t\timports: [],\n` +
					`\t\t\tmodule: ${JSON.stringify(`/${route.id}.js`)},\n` +
					`\t\t\thasAction: "action" in route${index},\n` +
					`\t\t\thasLoader: "loader" in route${index},\n` +
					`\t\t\thasCatchBoundary: "CatchBoundary" in route${index},\n` +
					`\t\t\thasErrorBoundary: "ErrorBoundary" in route${index},\n` +
					"\t\t},"
			)
			.join("\n\t") +
		"\t\t\n}";

	await Deno.writeTextFile(
		generatedFile,
		`// DO NOT EDIT. This file is generated by remix-deno-jit.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running \`deno task dev\`.

import * as serverEntry from ${JSON.stringify(serverEntry)};
${routeImports}

export const entry = { module: serverEntry };
export const routes = ${routesObject};
export const assets = {
  entry: { imports: [], module: ${JSON.stringify(`/entry.client.js`)} },
  routes: ${assetRoutes},
};
export const future = {
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
    v2_dev: true,
};
`
	);
}

let defaultPort = Number(Deno.env.get("PORT"));
defaultPort = Number.isSafeInteger(defaultPort) ? defaultPort : 8080;

export async function dev({
	generatedFile = Deno.cwd() + "/remix.gen.ts",
	assetsDirectory = path.resolve(Deno.cwd(), "assets"),
	port = defaultPort,
	...options
}: CommonOptions) {
	const mode = "development";

	const handler = await createRequestHandler({
		...options,
		assetsDirectory,
		mode,
		generatedFile,
	});
	serve(
		async (req, connInfo) => {
			const start = Date.now();
			//const isLog = await Logging(req);
			//if (isLog) return isLog;
			const redirect = NoTrailing(req);
			if (redirect) return redirect;
			const resp = handler(req);
			console.log(`${req.method} ${req.url} ${Date.now() - start}ms`);
			await SendLog(start, req, connInfo);
			return resp;
		},
		{ port }
	);
}

export async function start({
	generatedFile = Deno.cwd() + "/remix.gen.ts",
	port = defaultPort,
	assetsDirectory = path.resolve(Deno.cwd(), "assets"),
	...options
}: CommonOptions) {
	const mode = "production";

	const handler = await createRequestHandler({
		...options,
		assetsDirectory,
		mode,
		generatedFile,
	});
	serve(
		async (req, connInfo) => {
			const start = Date.now();
			//const isLog = await Logging(req);
			//if (isLog) return isLog;
			const redirect = NoTrailing(req);
			if (redirect) return redirect;
			const resp = handler(req);
			console.log(`${req.method} ${req.url} ${Date.now() - start}ms`);
			await SendLog(start, req, connInfo);
			return resp;
		},
		{ port }
	);
}
