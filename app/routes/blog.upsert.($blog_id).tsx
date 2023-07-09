/** @format */

import Card from "../components/Cards/index.tsx";
import Button from "../components/Button/index.tsx";
import { InvalidMethod } from "../../ResponseHelpers.ts";
import { RequireFormWithMethodModel } from "../Helpers/FormValues.ts";
import {
	BlogModel,
	CreateBlog,
	DeleteBlog,
	DeleteBlogModel,
	GetBlog,
	UpdateBlog,
	UpdateBlogModel,
} from "../models/Blogs.server.ts";
import { DataFunctionArgs, redirect } from "@remix-run/deno";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request, params }: DataFunctionArgs) => {
	const blog_id = params.blog_id;
	if (blog_id) {
		return typedjson({
			blog: await GetBlog(blog_id),
		});
	}
	return typedjson({ blog: null });
};

export const action = async ({ request }: DataFunctionArgs) => {
	const method = request.method.toLowerCase();
	if (method === "post") {
		const data = await request.formData();
		const { method, parsed: blog_post } = RequireFormWithMethodModel(data, {
			delete: DeleteBlogModel,
			post: BlogModel,
			patch: UpdateBlogModel,
		});
		if (method === "delete") {
			await DeleteBlog(blog_post.id);
			return redirect("/blog");
		}
		if (method === "post") {
			await CreateBlog(blog_post);
			return redirect("/blog");
		}
		if (method === "patch") {
			await UpdateBlog(blog_post);
			return redirect("/blog");
		}
		return redirect("/blog");
	}
	return InvalidMethod();
};

const CreateBlogRoute = () => {
	const { blog } = useTypedLoaderData<typeof loader>();

	return (
		<div className="mt-3 w-full flex flex-col items-center">
			<Card
				component="form"
				method="POST"
				className="rounded-xl shadow-xl w-1/2 gap-3 min-w-[20rem] max-w-xl bg-slate-300 p-3 flex flex-col items-center">
				<h1>Create A Blog Post</h1>
				<input
					className="bg-transparent"
					type="text"
					name="title"
					placeholder="Title"
				/>
				<textarea
					className="resize-none bg-transparent"
					name="content"
					placeholder="Content"
					rows={3}
				/>
				<Button
					variant="outlined"
					name="method"
					value={blog ? "patch" : "post"}>
					Submit
				</Button>
			</Card>
		</div>
	);
};

export default CreateBlogRoute;
