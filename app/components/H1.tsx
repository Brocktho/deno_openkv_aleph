/** @format */

import React from "react";
import { ClassOptions, CreateClasses } from "../StyleHelpers.ts";
import { clsx } from "clsx";

export interface H1Props extends React.HTMLAttributes<HTMLHeadingElement> {
	clsxs?: ClassOptions;
	children: React.ReactNode | React.ReactNode[];
}

const DefaultH1Clsxs: ClassOptions = {
	text_size: "text-xl",
	w: "w-full",
	color: "",
};

const H1 = (props: H1Props) => {
	const { clsxs, children, className, ...rest } = props;
	return (
		<h1
			{...rest}
			className={clsx(CreateClasses(DefaultH1Clsxs, {}), className)}>
			{children}
		</h1>
	);
};

export default H1;
