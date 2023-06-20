/** @format */

import type * as React from "react";
declare module "react" {
	function forwardRef<T, P = {}>(
		render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
	): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export interface DefaultOverridableProps<D extends React.ElementType = "div">
	extends React.HtmlHTMLAttributes<HTMLDivElement> {
	ref?: React.Ref<Element>;
	component?: D;
}

export type OverridableProps<
	D extends React.ElementType = "div",
	Props = DefaultOverridableProps<D>
> = Props & React.ComponentPropsWithoutRef<D>;
