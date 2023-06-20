/** @format */

import { Head } from "aleph/react";
import Card from "~/components/Cards/index.tsx";
import Button from "../components/Button/index.tsx";
import { InvalidMethod } from "../ResponseHelpers.ts";
import { RequireFormModel } from "../FormHelpers/FormValues.ts";
import { BlogKey, BlogModel } from "../models/Blogs.ts";
import { json, redirecting, useTypedData } from "../AlephRequest.ts";

export async function mutation(req: Request): Promise<Response> {
	const method = req.method;
	if (method === "POST") {
		const data = await req.formData();
		const blog_post = RequireFormModel(data, BlogModel);
		const db = await Deno.openKv();
		await db.set([BlogKey, blog_post.id], blog_post);
		return redirecting("/blog");
	}
	return InvalidMethod();
}

const CreateBlogRoute = () => {
	return (
		<div className="mt-3 w-full flex flex-col items-center">
			<Head>
				<title> New Blog! </title>
			</Head>
			<Card
				component="form"
				method="POST"
				action="/createBlog"
				className="rounded-xl shadow-xl w-1/2 gap-3 min-w-[20rem] max-w-xl bg-slate-300 p-3 flex flex-col items-center">
				<h1> Create A Blog Post </h1>
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
				<Button variant="outlined">Submit</Button>
			</Card>
		</div>
	);
};

export default CreateBlogRoute;
