/** @format */

import {
  CheckLogHash,
  LogMessageModel,
  UpsertLog,
} from "../app/models/Logging.server.ts";

const Logging = async (req: Request) => {
  const method = req.method.toLocaleLowerCase();
  const url = new URL(req.url);
  if (url.pathname.split("?")[0] === window.LOG_URL && method === "post") {
    const { body, valid } = await CheckLogHash(req);
    if (!valid) return new Response("Invalid Signature", { status: 401 });
    try {
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
