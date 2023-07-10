/** @format */

import Card from "../components/Cards/index.tsx";
import H1 from "../components/H1.tsx";
import type { LoaderArgs } from "@remix-run/deno";
import { GetBlog } from "../models/Blogs.server.ts";
import { RequiredParam } from "../Helpers/Params.ts";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import marked, { MarkdownStyles } from "../Helpers/Markdown.ts";
import GenericError from "../Helpers/Errors.tsx";

export const links = () => MarkdownStyles;

export const loader = async ({ params }: LoaderArgs) => {
	try {
		const blog = await GetBlog(RequiredParam(params, "blog_id"));
		const content = marked(blog.content);
		return typedjson({ blog: { ...blog, content }, error: null });
	} catch (e) {
		console.error(e);
		return typedjson({ blog: null, error: e });
	}
};

export default function ViewBlogRoute() {
	const { blog, error } = useTypedLoaderData<typeof loader>();
	return (
		<article className="flex flex-col items-center w-full pt-3">
			{blog && (
				<Card clsxs={{ w: "w-full max-w-xl" }}>
					<H1 className="w-full text-xl">{blog.title}</H1>
					<p
						className="w-full markdown"
						dangerouslySetInnerHTML={{
							__html: blog.content,
						}}
					/>
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
			)}
			{error && <div>Well shucks</div>}
		</article>
	);
}

export const ErrorBoundary = () => {
	return <GenericError />;
};
