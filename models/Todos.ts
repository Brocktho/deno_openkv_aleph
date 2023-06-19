/** @format */

import { z } from "zod";

export const MessageModel = z.string().min(1).max(191);

export const CreateTodoModel = z.object({
	message: MessageModel,
});

export const TargetTodoModel = z.object({
	id: z.coerce.number(),
	completed: z.boolean().default(false),
});

export const TodoModel = z.object({
	id: z.date(),
	message: MessageModel,
	completed: z.boolean().default(false),
});

export const TodosModel = z.array(TodoModel).nullable().default([]);
