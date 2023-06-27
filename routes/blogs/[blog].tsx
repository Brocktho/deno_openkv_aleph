/** @format */

import { json, useTypedData } from "~/AlephRequest.ts";
import { TypedDb } from "../../FormHelpers/FormValues.ts";
import { Blog, BlogKey, BlogModel } from "../../models/Blogs.ts";
import Card from "../../components/Cards/index.tsx";
import H1 from "../../components/H1.tsx";

export const data = {
	defer: false,
	async fetch(_: Request, ctx: Context) {
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
		<article className="flex flex-col items-center w-full pt-3">
			<Card clsxs={{ w: "w-full max-w-xl" }}>
				<H1 className="w-full text-xl">{blog.title}</H1>
				<p className="w-full">{blog.content}</p>
				<p className="w-full flex flex-row items-center gap-3 px-3">
					<time
						dateTime={
							blog.created_at instanceof Date
								? blog.created_at.toISOString()
								: `${blog.created_at}`
						}>
						Originally Created:{" "}
						{blog.created_at instanceof Date
							? blog.created_at.toISOString()
							: `${blog.created_at}`}
					</time>
					<time
						dateTime={
							blog.updated_at instanceof Date
								? blog.updated_at.toISOString()
								: `${blog.updated_at}`
						}>
						Last Updated:{" "}
						{blog.updated_at instanceof Date
							? blog.updated_at.toISOString()
							: `${blog.updated_at}`}
					</time>
				</p>
			</Card>
		</article>
	);
}
