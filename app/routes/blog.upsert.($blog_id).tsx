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

import Modal from "../components/Modal/index.tsx";
import marked, { MarkdownStyles } from "../Helpers/Markdown.ts";
import { useState } from "react";

export const links = () => MarkdownStyles;

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
	const [preview, setPreview] = useState(false);
	const [content, setContent] = useState(blog?.content || "");
	return (
		<Modal
			open={true}
			component="form"
			card={{
				method: "POST",
				clsxs: {
					p: "p-3",
					w: "max-w-2xl w-full min-w-[20rem]",
				},
			}}>
			<h1>Create A Blog Post</h1>
			<input
				className="bg-transparent"
				type="text"
				name="title"
				placeholder="Title"
			/>
			<div className="flex flex-row items-center flex-wrap gap-3">
				<Button
					variant="text"
					disabled={!preview}
					onClick={e => {
						e.preventDefault();
						setPreview(false);
					}}>
					{preview ? "Edit" : "Editing"}
				</Button>
				<Button
					variant="text"
					disabled={preview}
					onClick={e => {
						e.preventDefault();
						setPreview(true);
					}}>
					{preview ? "Previewing" : "Preview"}
				</Button>
			</div>
			<ul>
				<li>item</li>
			</ul>
			{!preview ? (
				<textarea
					className="resize-none bg-transparent"
					name="content"
					placeholder="Content"
					rows={3}
					value={content}
					onChange={e => {
						setContent(e.target.value);
					}}
				/>
			) : (
				<p
					dangerouslySetInnerHTML={{
						__html: marked(content),
					}}
					className="markdown"
				/>
			)}
			<Button
				variant="outlined"
				name="method"
				value={blog ? "patch" : "post"}>
				Submit
			</Button>
		</Modal>
	);
};

export default CreateBlogRoute;