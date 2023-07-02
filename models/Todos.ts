/** @format */

import { z } from "zod";

export const MessageModel = z.string().min(1).max(191);

export const CreateTodoModel = z.object({
  message: MessageModel,
});

export const TargetTodoModel = z.object({
  id: z.string().uuid(),
  completed: z.enum(["true", "false"]),
});

export const TodoModel = z.object({
  id: z.string().uuid(),
  message: MessageModel,
  completed: z.boolean().default(false),
});

export type Todo = z.infer<typeof TodoModel>;

export const TodosModel = z.array(TodoModel).default([]);
