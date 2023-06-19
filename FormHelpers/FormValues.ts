/** @format */

import { z, ZodRawShape, type ZodTypeAny } from "zod";

export const MethodModel = z.enum(["post", "put", "patch", "delete"]);

export const RequireFormModel = <T extends ZodRawShape>(
	formData: FormData,
	model: z.ZodObject<T>
) => {
	const data: Record<string, string | Array<string>> = {};
	for (const [key, value] of formData.entries()) {
		if (typeof value === "string") {
			const prev = data[key];
			if (prev) {
				if (Array.isArray(prev)) {
					prev.push(value);
					data[key] = prev;
				} else {
					data[key] = [prev, value];
				}
			} else {
				data[key] = value;
			}
		}
	}
	return model.parse(data);
};

export const ValidateJson = <T extends ZodTypeAny>(json: string, model: T) => {
	const data = JSON.parse(json);
	return model.parse(data);
};

export const TypedDb = async <T extends ZodTypeAny>(
	db_key: Array<string>,
	model: T
) => {
	return await Deno.openKv().then(db => {
		return db.get(db_key).then(entry => {
			return { value: model.parse(entry.value) as z.infer<T>, db };
		});
	});
};
