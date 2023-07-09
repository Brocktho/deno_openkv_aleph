/** @format */

import { typedjson } from "remix-typedjson";
import { GetLogsByTime } from "../models/Logging.server.ts";

export const loader = async () => {
	return typedjson({
		logs: await GetLogsByTime(),
	});
};
