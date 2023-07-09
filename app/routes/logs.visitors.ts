/** @format */

import { typedjson } from "remix-typedjson";
import { GetVisitors } from "../models/Logging.server.ts";

export const loader = async () => {
	return typedjson({
		logs: await GetVisitors(),
	});
};
