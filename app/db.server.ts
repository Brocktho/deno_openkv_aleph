/** @format */

import { z, ZodTypeAny } from "zod";

export type DenoKv = Awaited<ReturnType<typeof Deno.openKv>>;

export class KvError extends Error {
	constructor(message: string, public status: number) {
		super(message);
		this.name = "KvError";
		this.status = status;
	}

	static NotFound(message?: string) {
		return new KvError(message || "Not Found, But Required", 404);
	}

	static NoDatabase(message?: string) {
		return new KvError(
			message || "Unable to acquire database connection.",
			500
		);
	}

	static FailedReady(message?: string) {
		return new KvError(
			message || "Database is ready but connection is undefined.",
			500
		);
	}
}

// Remix a little poopy for not allowing top level await :(
// Compilers suck sometimes.
export class Kv {
	db: DenoKv | undefined;
	static singleton: Kv | null = null;
	ready = false;
	retries: number;
	constructor(retries = 3) {
		Deno.openKv().then(connection => {
			this.db = connection;
			this.ready = true;
		});
		this.retries = retries;
	}

	static getInstance() {
		if (this.singleton == null) {
			this.singleton = new Kv();
		}
		return this.singleton;
	}

	async requireConnection() {
		let attempts = 1;
		while (!this.ready && attempts <= this.retries) {
			await new Promise(resolve => setTimeout(resolve, 150 * attempts));
			attempts++;
		}
		if (this.ready) {
			return;
		}
		throw KvError.NoDatabase();
	}

	async requireGet<T extends ZodTypeAny>(key: Array<string>, model: T) {
		const data = await this.get(key);
		if (data.value === null) {
			throw KvError.NotFound(`No Record Found for: ${key.toString()}`);
		}
		return model.parse(data.value) as z.infer<T>;
	}

	async get<T = unknown>(key: Array<string>) {
		await this.requireConnection();
		if (this.db === undefined) throw KvError.FailedReady();
		return this.db.get<T>(key);
	}

	async set(key: Array<string>, value: unknown) {
		await this.requireConnection();
		if (this.db === undefined) throw KvError.FailedReady();
		return await this.db.set(key, value);
	}

	async list(
		selector: Parameters<DenoKv["list"]>[0],
		options?: Parameters<DenoKv["list"]>[1]
	) {
		await this.requireConnection();
		if (this.db === undefined) throw KvError.FailedReady();
		return this.db.list(selector, options);
	}

	async requireList<T extends ZodTypeAny>(
		selector: Parameters<DenoKv["list"]>[0],
		model: T,
		options?: Parameters<DenoKv["list"]>[1]
	) {
		const list = await this.list(selector, options);
		const data: Array<z.infer<T>> = [];
		for await (const entry of list) {
			try {
				data.push(model.parse(entry.value));
			} catch (e) {
				console.error(e);
				this.db!.atomic().check(entry).delete(entry.key).commit();
			}
		}
		return data;
	}

	async collectList(
		selector: Parameters<DenoKv["list"]>[0],
		options?: Parameters<DenoKv["list"]>[1]
	) {
		const list = await this.list(selector, options);
		const data = [];
		for await (const entry of list) {
			data.push(entry);
		}
		return data;
	}

	/* 	async atomic() {
		await this.requireConnection();
		console.log(this.db);
		if (this.db === undefined)
		throw KvError.FailedReady();
		return this.db.atomic;
	} */

	async get_db() {
		await this.requireConnection();
		if (this.db === undefined) throw KvError.FailedReady();
		return this.db;
	}
}

let db: Kv;

declare global {
	// deno-lint-ignore no-var
	var __db__: Kv;
}

if (Deno.env.get("NODE_ENV") === "production") {
	db = Kv.getInstance();
} else {
	if (!window.__db__) {
		window.__db__ = Kv.getInstance();
	}
	db = window.__db__;
}

export default db;
