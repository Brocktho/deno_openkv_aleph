/** @format */

import { z } from "zod";
import db from "../db.server.ts";
import { CheckHash, CreateHash } from "../Helpers/Hashing.ts";
import { RequireSecret } from "../Helpers/Secrets.ts";
import CollectIps from "../../Middlewares/CollectIp.ts";
import { ConnInfo } from "https://deno.land/std@0.192.0/http/server.ts";

export const LogByTimeKey = "logs_by_time" as const;
export const LogByRouteKey = "log_by_route" as const;
export const VisitorKey = "visitors" as const;
export const LogHashKey = "X-SHA256-LOG-SIGNATURE" as const;
export const LogSecretKey = "LOGGING_KEY" as const;
export const LogMessageModel = z.object({
	time: z.number(),
	method: z.string(),
	url: z.string().min(1).max(191),
	ip: z.string(),
});

export const CheckLogHash = async (request: Request) => {
	const body = await request.json();
	const signature = request.headers.get(LogHashKey);
	return {
		body,
		valid: CheckHash({
			hashType: "sha256",
			environString: RequireSecret(LogSecretKey),
			body,
			signature,
		}),
	};
};

export const AddLogHash = (body: string, headers: Headers) => {
	const signature = CreateHash({
		hashType: "sha256",
		environString: RequireSecret("LOGGING_KEY"),
		body,
	});
	headers.append(LogHashKey, signature);
	return headers;
};

export const UpsertLog = async (log: z.infer<typeof LogMessageModel>) => {
	const prev_time_log_p = db.get([
		LogByTimeKey,
		`${log.time}`,
		log.url,
		log.method,
	]);
	const prev_route_log_p = db.get<{
		time: number;
		method: string;
		occurences: Deno.KvU64;
	}>([LogByRouteKey, log.url]);
	const visitor_p = db.get([VisitorKey, log.ip]);
	const [prev_time_log, prev_route_log, visitor] = await Promise.all([
		prev_time_log_p,
		prev_route_log_p,
		visitor_p,
	]);
	return db.get_db().then(db => {
		return db
			.atomic()
			.check(prev_time_log)
			.check(prev_route_log)
			.check(visitor)
			.mutate({
				key: [LogByTimeKey, `${log.time}`, log.url, log.method],
				type: "sum",
				value: new Deno.KvU64(BigInt(1)),
			})
			.mutate({
				key: [LogByRouteKey, log.url, `${log.time}`, log.method],
				type: "sum",
				value: new Deno.KvU64(BigInt(1)),
			})
			.mutate({
				key: [VisitorKey, log.ip],
				type: "sum",
				value: new Deno.KvU64(BigInt(1)),
			})
			.commit();
	});
};

export const GetLogsByTime = () => {
	return db.collectList({ prefix: [LogByTimeKey] });
};

export const GetLogsByRoute = () => {
	return db.collectList({ prefix: [LogByRouteKey] });
};

export const GetVisitors = () => {
	return db.collectList({ prefix: [VisitorKey] });
};

export const SendLog = (
	start: number,
	request: Request,
	connInfo: ConnInfo
) => {
	const body = JSON.stringify({
		time: start - Date.now(),
		method: request.method.toLocaleLowerCase(),
		url: new URL(request.url).pathname.split("?")[0],
		ip: CollectIps(connInfo),
	});
	console.log(`Send Log to: ${window.APP_URL + window.LOG_URL}`);
	fetch(window.APP_URL + window.LOG_URL, {
		method: "POST",
		body,
		headers: AddLogHash(
			body,
			new Headers({
				"Content-Type": "application/json",
			})
		),
	});
};
