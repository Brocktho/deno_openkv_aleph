/** @format */

import { z, ZodRawShape, type ZodTypeAny } from "zod";

export const MethodModel = z.enum(["post", "put", "patch", "delete"]);

export const ExtractFormData = (formData: FormData) => {
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
	return data;
};

export const RequireFormModel = <T extends ZodRawShape>(
	formData: FormData,
	model: z.ZodObject<T>
) => {
	const data = ExtractFormData(formData);
	return model.parse(data);
};

export const RequireFormWithMethodModel = <
	Delete extends ZodRawShape,
	Put extends ZodRawShape,
	Patch extends ZodRawShape,
	Post extends ZodRawShape
>(
	formData: FormData,
	models: {
		delete?: z.ZodObject<Delete>;
		put?: z.ZodObject<Put>;
		patch?: z.ZodObject<Patch>;
		post?: z.ZodObject<Post>;
	}
) => {
	const data = ExtractFormData(formData);
	if ("method" in data) {
		const method = MethodModel.parse(data.method);
		const model_entry = models[method];
		if (model_entry) {
			if (method === "delete") {
				const model = model_entry as unknown as NonNullable<
					(typeof models)["delete"]
				>;
				return {
					method: "delete" as const,
					parsed: model.parse(data),
				};
			}
			if (method === "put") {
				const model = model_entry as unknown as NonNullable<
					(typeof models)["put"]
				>;
				return {
					method: "put" as const,
					parsed: model.parse(data),
				};
			}
			if (method === "patch") {
				const model = model_entry as NonNullable<
					(typeof models)["patch"]
				>;
				return {
					method: "patch" as const,
					parsed: model.parse(data),
				};
			}
			if (method === "post") {
				const model = model_entry as unknown as NonNullable<
					(typeof models)["post"]
				>;
				return {
					method: "post" as const,
					parsed: model.parse(data),
				};
			}
		}
		throw new Error("Method was given but model not found.");
	}
	throw new Error("Method was desired but not found.");
};

export const ValidateJson = <T extends ZodTypeAny>(json: string, model: T) => {
	const data = JSON.parse(json);
	return model.parse(data);
};
