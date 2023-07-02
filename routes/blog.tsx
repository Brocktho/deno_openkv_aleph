/** @format */

import { Head } from "$fresh/runtime.ts";
import { GetManyTyped, TypedDb } from "~/FormHelpers/FormValues.ts";
import { Blog, BlogKey, BlogModel } from "~/models/Blogs.ts";
import Button from "../components/Button/index.tsx";
import BlogPostCard from "../components/BlogPost.tsx";
import H1 from "../components/H1.tsx";
import Spinner from "../components/Spinner.tsx";
import { PageProps } from "$fresh/server.ts";
import Route from "../components/Route.tsx";

export const handler: MultiHandler = {
	async GET(_req, ctx) {
		const blog_posts = (await GetManyTyped([BlogKey], BlogModel)).sort(
			(prev, next) => (prev.created_at > next.created_at ? -1 : 1)
		);
		const resp = await ctx.render({ blog_posts });
		return resp;
	},
};

const BlogRoute = ({ data }: PageProps) => {
	return (
		<Route>
			<div className="flex flex-row items-center justify-between px-3">
				<H1 className="text-center">Welcome to my blog!</H1>
				<Button
					variant="outlined"
					clsxs={{ w: "w-32" }}
					component={"a"}
					href="/createBlog">
					+ Blog
				</Button>
			</div>
			<div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3">
				{data.blog_posts.length === 0 ? (
					<H1 className="text-center">No posts yet!</H1>
				) : (
					data.blog_posts.map(post => {
						const continued = post.content.length > 30;
						return (
							<BlogPostCard
								key={post.id}
								id={post.id}
								title={post.title}
								description={`${post.content.substring(0, 30)}${
									continued ? "..." : ""
								}`}
								created_at={post.created_at}
							/>
						);
					})
				)}
			</div>
		</Route>
	);
};

export default BlogRoute;
