/** @format */

import {
	CheckLogHash,
	LogMessageModel,
	UpsertLog,
} from "../app/models/Logging.server.ts";

const Logging = async (req: Request) => {
	const method = req.method.toLocaleLowerCase();
	const url = new URL(req.url);
	console.log("Check Logging");
	if (url.pathname.split("?")[0] === window.LOG_URL && method === "post") {
		const { body, valid } = await CheckLogHash(req);
		console.log("Hit the log route");
		if (!valid) return new Response("Invalid Signature", { status: 401 });
		try {
			console.log("Logging");
			const parsed = LogMessageModel.parse(body);
			await UpsertLog(parsed);
			return new Response("Logged");
		} catch (e) {
			console.error(e);
			return new Response("Invalid Body", { status: 400 });
		}
	}
	return null;
};

export default Logging;
