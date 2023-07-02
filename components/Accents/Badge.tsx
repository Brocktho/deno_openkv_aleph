/** @format */

import React, { useEffect, useRef, useState } from "preact";
import type { ClassOptions } from "~/StyleHelpers";

export interface BadgeProps extends React.HtmlHTMLAttributes<HTMLLabelElement> {
	clsxs?: ClassOptions;
	children: React.ReactElement<any, any>;
}

const Badge = React.forwardRef(function Badge(
	{ children }: BadgeProps,
	ref: React.ForwardedRef<HTMLLabelElement>
) {
	const childref = useRef();
	let [childNode, setChildNode] = useState<Element>();
	let childProps = { ...children.props, ref: childref };
	//const forked = useForkRef(children.ref, setChildNode, ref);
	if (process.env.NODE_ENV !== "production") {
		childProps["data-material-wind-cloned-element"] = true;

		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			if (
				childNode &&
				childNode?.getAttribute("data-material-wind-cloned-element") !==
					"true"
			) {
				console.error(
					"Unable to properly pass ref to child element, make sure you are spreading props on the child element."
				);
			}
		}, [childNode]);
	}
	const cloned = React.cloneElement(children, childProps);
	return (
		<React.Fragment>
			{cloned}
			<label ref={ref}></label>
		</React.Fragment>
	);
});

export default Badge;
