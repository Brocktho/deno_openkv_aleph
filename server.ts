/** @format */

// deno-lint-ignore-file no-var
/** @format */

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createRequestHandlerWithStaticFiles } from "@remix-run/deno";
import NoTrailing from "./Middlewares/noTrailing.ts";
import Logging from "./Middlewares/Logging.ts";
import { load } from "https://deno.land/std@0.192.0/dotenv/mod.ts";
// Import path interpreted by the Remix compiler
import * as build from "@remix-run/dev/server-build";
import { RequireSecret } from "./app/Helpers/Secrets.ts";
import { SendLog } from "./app/models/Logging.server.ts";

if (Deno.env.get("NODE_ENV") === "development") {
	load().then(env => {
		Object.keys(env).forEach(key => {
			Deno.env.set(key, env[key]);
		});
	});
}

declare global {
	var APP_URL: string;
	var LOG_URL: string;
}

window.APP_URL = RequireSecret("APP_URL");
window.LOG_URL = RequireSecret("LOG_URL");

const remixHandler = createRequestHandlerWithStaticFiles({
	build,
	mode: Deno.env.get("NODE_ENV"),
	getLoadContext: () => ({}),
});

const port = Number(Deno.env.get("PORT")) || 8000;

serve(
	async (req, connInfo) => {
		const start = Date.now();
		const isLog = await Logging(req);
		if (isLog) return isLog;
		const redirect = NoTrailing(req);
		if (redirect) return redirect;
		const resp = remixHandler(req);
		console.log(`${req.method} ${req.url} ${Date.now() - start}ms`);
		SendLog(start, req, connInfo);
		return resp;
	},
	{ port }
);
