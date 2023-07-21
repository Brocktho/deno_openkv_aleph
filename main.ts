/** @format */

import { start } from "./runtime.ts";

import * as manifest from "./remix.gen.ts";
import type { ServerBuild } from "@remix-run/server-runtime";

start({
	manifest: manifest as unknown as ServerBuild,
});
