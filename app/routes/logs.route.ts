/** @format */

import { typedjson } from "remix-typedjson";
import { GetLogsByRoute } from "../models/Logging.server.ts";

export const loader = async () => {
	return typedjson({
		logs: await GetLogsByRoute(),
	});
};
