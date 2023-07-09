/** @format */

import { z } from "zod";
import db from "../db.server.ts";
import { ulid } from "https://esm.sh/ulid@2.3.0";

export const TodoKey = "todo" as const;
export const MessageModel = z.string().min(1).max(191);

export const CreateTodoModel = z.object({
	message: MessageModel,
});

export const UpdateTodoModel = z.object({
	id: z.string().ulid(),
	completed: z.enum(["true", "false"]),
});

export const DeleteTodoModel = z.object({
	id: z.string().ulid(),
});

export const TodoModel = z.object({
	id: z.string().ulid().default(ulid()),
	message: MessageModel,
	completed: z.boolean().default(false),
});

export type Todo = z.infer<typeof TodoModel>;

export const GetTodos = (user_id: string) => {
	return db.requireList({ prefix: [TodoKey, user_id] }, TodoModel);
};

export const CreateTodo = (
	user_id: string,
	todo: z.infer<typeof TodoModel>
) => {
	return db.set([TodoKey, user_id, todo.id], todo);
};

export const DeleteTodo = async (
	user_id: string,
	todo: z.infer<typeof DeleteTodoModel>
) => {
	const result = await db.get([TodoKey, user_id, todo.id]);
	return db.get_db().then(db => {
		return db
			.atomic()
			.check(result)
			.delete([TodoKey, user_id, todo.id])
			.commit();
	});
};

export const UpdateTodo = async (
	user_id: string,
	todo: z.infer<typeof UpdateTodoModel>
) => {
	const result = await db.get([TodoKey, user_id, todo.id]);
	const completed = todo.completed === "true";
	return db.get_db().then(db => {
		return db
			.atomic()
			.check(result)
			.set([TodoKey, user_id, todo.id], { ...result, completed })
			.commit();
	});
};
