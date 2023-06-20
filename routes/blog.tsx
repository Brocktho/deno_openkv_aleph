/** @format */

import { Head } from "aleph/react";
import { json, useTypedData } from "~/AlephRequest.ts";
import { GetManyTyped, TypedDb } from "~/FormHelpers/FormValues.ts";
import { Blog, BlogKey, BlogModel } from "~/models/Blogs.ts";
import { Link } from "aleph/react";
import Button from "../components/Button/index.tsx";

export const data = {
	defer: false,
	fetch: async () => {
		const blog_posts = await GetManyTyped([BlogKey], BlogModel);
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
				<h1 className="text-xl">Welcome to my blog!</h1>
				<Button variant="outlined" component={Link} to="/createBlog">
					+ Blog
				</Button>
			</div>
			<div className="flex flex-col items-start gap-3">
				{blog_posts.length === 0 ? (
					<div className="w-full text-center">No posts yet!</div>
				) : (
					blog_posts.map(post => {
						return (
							<Link to={`/blogs/${post.id}`}>{post.title}</Link>
						);
					})
				)}
			</div>
		</div>
	);
};

export default BlogRoute;
