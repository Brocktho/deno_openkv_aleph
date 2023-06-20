/** @format */

// deno-lint-ignore-file

import { serialize, deserialize } from "superjson";
import { useData } from "https://deno.land/x/aleph@1.0.0-beta.43/framework/react/data.ts";
import { UpdateStrategy } from "https://deno.land/x/aleph@1.0.0-beta.43/framework/react/context.ts";
import { JsonValue } from "std/jsonc/parse.ts";

export type JsonResponse<T extends unknown = unknown> = Response & {
	json(): Promise<T>;
};

type AppData = any;
type DataFunction = (...args: any[]) => unknown;
type DataOrFunction = AppData | DataFunction;

export type GetTypedDataResponse<T extends DataOrFunction> = T extends (
	...args: any[]
) => infer Output
	? Awaited<Output> extends JsonResponse<infer U>
		? U
		: Awaited<ReturnType<T>>
	: Awaited<T>;

export function json<T extends unknown>(
	data: T,
	init: ResponseInit | number = {}
): JsonResponse<T> {
	const responseInit = typeof init === "number" ? { status: init } : init;
	const headers = new Headers(responseInit.headers);
	if (!headers.has("Content-Type")) {
		headers.set("Content-Type", "application/json; charset=utf-8");
	}
	const stringified = stringifyType(data);
	return new Response(stringified, {
		...responseInit,
		headers,
	}) as JsonResponse<typeof data>;
}

export type MetaType = ReturnType<typeof serialize>["meta"];

export type StringifiedReturn<T> = {
	__arr__: T | null;
	__meta__?: MetaType | null;
} & (T | { __meta__?: MetaType });

export const stringifyType = <T>(data: T) => {
	let { json, meta } = serialize(data);
	json = JSON.stringify(json);
	if (json && meta) {
		if (json.startsWith("{")) {
			json = `${json.substring(
				0,
				json.length - 1
			)},"__meta__":${JSON.stringify(meta)}}`;
		} else if (json.startsWith("[")) {
			json = `"__arr__":${json},"__meta__":${JSON.stringify(meta)}}`;
		}
	}
	return json;
};

export const parseType = <T>(data: StringifiedReturn<T>) => {
	if (!data) return data;
	if (data.__arr__) {
		let { __arr__, __meta__ } = data;
		if (__meta__) {
			return deserialize<T>({ json: __arr__, meta: __meta__ });
		}
		return __arr__;
	} else if (data.__meta__) {
		const meta = data.__meta__;
		delete data.__meta__;
		return deserialize<T>({ json: data as JsonValue, meta });
	}
	return data as T;
};

export type TypedMutation<T> = {
	[key in "post" | "put" | "patch" | "delete"]: (
		data?: unknown,
		updateStrategy?: UpdateStrategy<T>
	) => Promise<Response>;
};

export interface TypedData<T = AppData> extends ReturnType<typeof useData> {
	data: GetTypedDataResponse<T>;
}

export function useTypedData<T = AppData>(): TypedData<T> {
	const { data, ...rest } = useData();
	let typedData = parseType<T>(
		data as StringifiedReturn<T>
	) as GetTypedDataResponse<T>;
	return { data: typedData, ...rest };
}

export const redirecting = (url: string) => {
	return new Response("", {
		status: 302,
		headers: {
			Location: url,
		},
	});
};
