/** @format */

import { z } from "zod";
import { ulid } from "ulid";

import db from "../db.server.ts";
import { GenerateDate } from "../Helpers/Zod.ts";
export const BlogKey = "blog" as const;
export const BlogTitleIndex = "blog_by_title" as const;
export const BlogUpdateIndex = "blog_by_updated" as const;
export const BlogPrimary = "id";
export const BlogTitle = "title";
export const BlogUpdated = "updated_at";

export const LegacyBlogModel = z.object({
  id: z.string().uuid().default(crypto.randomUUID()),
  title: z.string().min(1).max(191),
  content: z.string().min(1),
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
});

export const BlogModel = z.object({
  id: z.string().ulid().default(ulid),
  title: z.string().min(1).max(191),
  content: z.string().min(1),
  created_at: z.date().default(GenerateDate),
  updated_at: z.date().default(GenerateDate),
});

export const UpdateBlogModel = z.object({
  id: z.string().ulid(),
  title: z.string().min(1).max(191),
  content: z.string().min(1),
  updated_at: z.date().default(GenerateDate),
});

export const DeleteBlogModel = z.object({
  id: z.string().ulid(),
});

export const BlogsModel = z.array(BlogModel).default([]);

export type Blog = z.infer<typeof BlogModel>;
export type LegacyBlog = z.infer<typeof LegacyBlogModel>;
export type UpdatedBlog = z.infer<typeof UpdateBlogModel>;

// Should only create one if one does not already exist
export const CreateBlog = async (blog: Blog) => {
  const primary = [BlogKey, blog[BlogPrimary]];
  const title = [BlogTitleIndex, blog[BlogTitle]];
  const updated = [BlogUpdateIndex, blog[BlogUpdated].toISOString()];
  const response = await db.get_db().then((db) => {
    return db
      .atomic()
      .check({
        key: primary,
        versionstamp: null,
      })
      .check({
        key: title,
        versionstamp: null,
      })
      .check({
        key: updated,
        versionstamp: null,
      })
      .set(primary, blog)
      .set(title, blog)
      .set(updated, blog)
      .commit();
  });

  if (!response.ok) {
    throw new Error(
      "Unable to create blog. One already exists with given keys.",
    );
  }
  return response;
};

export const UpdateOldBlogs = async (blog: LegacyBlog) => {
  const new_id = ulid(blog.created_at.getTime());
  const updated_blog: Blog = { ...blog, id: new_id };
  await CreateBlog(updated_blog).then(() => {
    DeleteLegacyBlog(blog.id);
  });
  return updated_blog;
};

export const GetBlog = (id: string) => {
  return db.requireGet([BlogKey, id], BlogModel);
};

export const GetBlogs = async () => {
  const data = await db.list({ prefix: [BlogKey] });
  const blogs: Blog[] = [];
  for await (const blog of data) {
    try {
      const new_blog = BlogModel.parse(blog.value);
      blogs.push(new_blog);
    } catch (_e) {
      // This is probably an old blog.
      try {
        const legacy_blog = LegacyBlogModel.parse(blog.value);
        blogs.push(legacy_blog);
        await UpdateOldBlogs(legacy_blog).then((updated_blog) => {
          blogs.push(updated_blog);
        });
      } catch (e) {
        // This should hopefully not happen.
        console.error(e);
      }
    }
  }
  return blogs;
  // Will use below when all blogs are updated.
  //return db.requireList([{ prefix: [BlogKey] }], BlogsModel);
};

export const UpdateBlog = async (blog: UpdatedBlog) => {
  const created_at = (await db.requireGet([BlogKey, blog.id], BlogModel))
    .created_at;
  return db.set([BlogKey, blog.id], { ...blog, created_at });
};

export const DeleteLegacyBlog = async (id: string) => {
  let res = { ok: false };
  while (!res.ok) {
    try {
      const getBlog = await db.get<LegacyBlog>([BlogKey, id]);
      if (getBlog.value === null) return;
      res = await db.get_db().then((db) => {
        return db
          .atomic()
          .check(getBlog)
          .delete([BlogKey, id])
          .commit();
      });
    } catch (e) {
      console.error(e);
    }
  }
};

export const DeleteBlog = async (id: string) => {
  let res = { ok: false };
  while (!res.ok) {
    try {
      const getBlog = await db.get<Blog>([BlogKey, id]);
      if (getBlog.value === null) return;
      res = await db.get_db().then((db) => {
        return db
          .atomic()
          .check(getBlog)
          .delete([BlogKey, id])
          .delete([BlogTitleIndex, getBlog.value.title])
          .delete([
            BlogUpdateIndex,
            getBlog.value.updated_at.toISOString(),
          ])
          .commit();
      });
    } catch (e) {
      console.error(e);
    }
  }
};
