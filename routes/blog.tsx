/** @format */

import { Head } from "aleph/react";
import { json, useTypedData } from "~/AlephRequest.ts";
import { GetManyTyped, TypedDb } from "~/FormHelpers/FormValues.ts";
import { Blog, BlogKey, BlogModel } from "~/models/Blogs.ts";
import { Link } from "aleph/react";
import Button from "../components/Button/index.tsx";
import BlogPostCard from "../components/BlogPost.tsx";
import H1 from "../components/H1.tsx";

export const data = {
	defer: false,
	fetch: async () => {
		const blog_posts = (await GetManyTyped([BlogKey], BlogModel)).sort(
			(prev, next) => (prev.created_at > next.created_at ? -1 : 1)
		);
		return json({ blog_posts });
	},
};

const BlogRoute = () => {
	const {
		data: { blog_posts },
	} = useTypedData<{ blog_posts: Blog[] }>();

	return (
		<div className="mt-3">
			<Head>
				<title>Brock's Blog</title>
			</Head>

			<div className="flex flex-row items-center justify-between px-3">
				<H1 className="text-center">Welcome to my blog!</H1>
				<Button
					variant="outlined"
					clsxs={{ w: "w-32" }}
					component={Link}
					to="/createBlog">
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
		</div>
	);
};

export default BlogRoute;
