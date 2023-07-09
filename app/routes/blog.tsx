/** @format */
import * as React from "react";
import { GetBlogs } from "../models/Blogs.server.ts";
import Button from "../components/Button/index.tsx";
import BlogPostCard from "../components/BlogPost.tsx";
import H1 from "../components/H1.tsx";
//import type { LoaderArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Outlet } from "@remix-run/react";
import GenericError from "../Helpers/Errors.tsx";

export const loader = async () => {
	const blog_posts = await GetBlogs();
	return typedjson({ blog_posts });
};

const BlogRoute = () => {
	const { blog_posts } = useTypedLoaderData<typeof loader>();
	return (
		<>
			<Outlet />
			<div className="flex flex-row items-center justify-between px-3">
				<H1 className="text-center">Welcome to my blog!</H1>
				<Button
					variant="outlined"
					clsxs={{ w: "w-32" }}
					component={"a"}
					href="/blog/upsert">
					+ Blog
				</Button>
			</div>
			<div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3">
				{blog_posts.length === 0 ? (
					<H1 className="text-center">No posts yet!</H1>
				) : (
					blog_posts.map(post => {
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
		</>
	);
};

export const ErrorBoundary = () => {
	return <GenericError />;
};

export default BlogRoute;
