/** @format */

import { json, useTypedData } from "~/AlephRequest.ts";
import { TypedDb } from "../../FormHelpers/FormValues.ts";
import { Blog, BlogKey, BlogModel } from "../../models/Blogs.ts";

export const data = {
	defer: false,
	async fetch(req: Request, ctx: Context) {
		const { value: blog } = await TypedDb(
			[BlogKey, ctx.params.blog],
			BlogModel
		);
		return json({ blog });
	},
};

export default function ViewBlogRoute() {
	const {
		data: { blog },
	} = useTypedData<{ blog: Blog }>();
	return (
		<div className="p-3 w-full max-w-xl flex flex-col gap-6 items-center">
			<h1>{blog.title}</h1>
			<p className="w-full">{blog.content}</p>
			<p className="w-full flex flex-row items-center gap-3 px-3">
				<span>
					Originally Created:{" "}
					{blog.created_at instanceof Date
						? blog.created_at.toISOString()
						: `${blog.created_at}`}
				</span>
				<span>
					Last Updated:{" "}
					{blog.updated_at instanceof Date
						? blog.updated_at.toISOString()
						: `${blog.updated_at}`}
				</span>
			</p>
		</div>
	);
}
