/** @format */

import * as React from "react";
import Card from "./Cards/index.tsx";
import H1 from "./H1.tsx";

const BlogPostCard = ({
	title,
	description,
	image,
	image_alt,
	id,
	created_at,
}: {
	title: string;
	description: string;
	image?: string;
	image_alt?: string;
	id: string;
	created_at: Date;
}) => {
	return (
		<Card
			clsxs={{ w: "min-w-[8rem] max-w-md w-full" }}
			component={"a"}
			href={`/blog/${id}`}
			interactable>
			<div className="w-full flex flex-row items-center justify-center min-h-[5rem] h-full max-h-[8rem]">
				{image ? (
					<img src={image} alt={image_alt ?? `${title} image`} />
				) : (
					<p>Images Coming Soon!</p>
				)}
			</div>
			<H1 className="text-start">
				{title.length > 30 ? `${title.substring(0, 30)}...` : title}
			</H1>
			<p className="w-full text-start">
				{description.length > 30
					? `${description.substring(0, 30)}...`
					: description}
			</p>
			<time
				suppressHydrationWarning
				dateTime={
					created_at instanceof Date
						? created_at.toLocaleDateString()
						: `${created_at}`
				}
				className="w-full text-start">
				Created On:{" "}
				{created_at instanceof Date
					? created_at.toLocaleDateString()
					: `${created_at}`}
			</time>
		</Card>
	);
};

export default BlogPostCard;
