/** @format */

import { dev } from "./runtime.ts";

Deno.env.set("NODE_ENV", "development");

dev({
  browserImportMapPath: Deno.cwd() + "/.vscode/resolve_npm_imports.json",
});
