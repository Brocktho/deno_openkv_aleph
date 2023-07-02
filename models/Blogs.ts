/** @format */

import { z } from "zod";
import { ulid } from "ulid";

export const BlogKey = "blog" as const;

export const BlogModel = z.object({
  id: z.string().uuid().default(ulid()),
  title: z.string().min(1).max(191),
  content: z.string().min(1).max(65535),
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
});

export const BlogsModel = z.array(BlogModel).default([]);

export type Blog = z.infer<typeof BlogModel>;
