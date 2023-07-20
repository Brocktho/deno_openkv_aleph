/** @format */

// -- esbuild --
// @deno-types="https://deno.land/x/esbuild@v0.17.19/mod.d.ts"
import esbuildWasm from "https://esm.sh/esbuild-wasm@0.17.19/lib/browser.js?pin=v127&target=deno";
import * as esbuildNative from "https://deno.land/x/esbuild@v0.17.19/mod.js";

export type { esbuildWasm };

// @ts-ignore trust me
export const esbuild: typeof esbuildWasm =
	Deno.Command === undefined ? esbuildWasm : esbuildNative;

let esbuildInitialized: boolean | Promise<void> = false;
export async function ensureEsbuildInitialized() {
	if (esbuildInitialized === false) {
		if (Deno.Command === undefined) {
			esbuildInitialized = esbuild.initialize({
				wasmURL: "https://esm.sh/esbuild-wasm@0.17.9/esbuild.wasm",
				worker: false,
			});
		} else {
			esbuild.initialize({});
		}
		await esbuildInitialized;
		esbuildInitialized = true;
	} else if (esbuildInitialized instanceof Promise) {
		await esbuildInitialized;
	}
}
