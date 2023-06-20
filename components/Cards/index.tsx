/** @format */

import clsx from "clsx";
import React, { createElement, forwardRef } from "react";

import {
	type ClassOptions,
	CreateClasses,
	CreateConditionalClass,
} from "~/StyleHelpers.ts";
import type {
	DefaultOverridableProps,
	OverridableProps,
} from "../utils/OverridableComponents.ts";

export interface DefaultCardProps<D extends React.ElementType = "section">
	extends DefaultOverridableProps<D> {
	clsxs?: ClassOptions;
	variant?: CardVariants;
	disabled?: boolean;
	children?: React.ReactNode;
}

export type CardProps<D extends React.ElementType = "section"> =
	OverridableProps<D, DefaultCardProps<D>>;

export const BaseCardClsxs: ClassOptions = {
	h: "h-auto",
	w: "w-auto",
	p: "px-3",
	rounded: "rounded-full",
	transition: "transition motion-reduce:transition-none",
	duration: "duration-200",
	align: "items-center",
	display: "flex flex-col",
	position: "relative",
};

export const ElevatedCardClsxs: ClassOptions = {
	...BaseCardClsxs,
	shadow: "shadow",
	bg: "bg-surface-light dark:bg-surface-dark",
	text: "text-primary-light dark:text-primary-dark",
	disabled:
		"bg-transparent before:bg-primary-light shadow-sm before:dark:bg-primary-dark text-on-surface-light dark:text-on-surface-dark opacity-disabled before:opacity-active",
	hover: "before:hover:bg-primary-light before:dark:hover:bg-primary-dark before:hover:opacity-hover before:hover:shadow-md",
	focus_visible:
		"focus-visible:outline-none before:focus-visible:bg-primary-light before:dark:focus-visible:bg-primary-dark before:focus-visible:opacity-focus",
	active: "before:active:bg-primary-light before:dark:active:bg-primary-dark before:active:opacity-active before:active:shadow",
};

export const FilledCardClsxs: ClassOptions = {
	...BaseCardClsxs,
	shadow: "shadow-sm",
	bg: "bg-primary-light dark:bg-primary-dark",
	text: "text-on-primary-light dark:text-on-primary-dark",
	disabled:
		"bg-transparent before:bg-on-surface-light before:dark:bg-on-surface-dark text-on-surface-light dark:text-on-surface-dark opacity-disabled before:opacity-active",
	hover: "before:hover:bg-on-primary-light before:dark:hover:bg-on-primary-dark before:hover:shadow before:hover:opacity-hover",
	focus_visible:
		"focus-visible:outline-none before:focus-visible:bg-on-primary-light before:dark:focus-visible:bg-on-primary-dark before:focus-visible:shadow-sm before:focus-visible:opacity-focus",
	active: "before:active:bg-on-primary-light before:dark:active:bg-on-primary-dark before:active:shadow-sm before:active:opacity-active",
};

export const OutlinedCardClsxs: ClassOptions = {
	...BaseCardClsxs,
	bg: "bg-transparent",
	text: "text-primary-light dark:text-primary-dark",
	border: "border border-outline-light dark:border-outline-dark",
	hover: "before:hover:shadow-inner before: before:hover:bg-primary-light before:dark:hover:bg-primary-dark before:hover:opacity-hover",
	focus_visible:
		"focus-visible:outline-none before:focus-visible:bg-primary-light before:dark:focus-visible:bg-primary-dark before:focus-visible:opacity-focus",
	active: "before:active:w-full before:active:bg-primary-light before:dark:active:bg-primary-dark before:active:opacity-active",
	disabled:
		"border-on-surface-light dark:border-on-surface-dark text-on-surface-light dark:text-on-surface-dark opacity-disabled",
};

export type CardVariants = "elevated" | "filled" | "outlined";

const Variants: Record<CardVariants, ClassOptions> = {
	elevated: ElevatedCardClsxs,
	filled: FilledCardClsxs,
	outlined: OutlinedCardClsxs,
};

export const Card = forwardRef(function Card<
	D extends React.ElementType = "section"
>(props: CardProps<D>, ref: React.Ref<Element>) {
	const {
		component = "section",
		children,
		clsxs,
		disabled,
		active,
		variant = "elevated",
		className,
		...rest
	} = props;
	const { disabledU, ...userClsx } = clsxs || {};
	const { disabledDef, ...defaultClsx } = Variants[variant];
	const finalProps = {
		...rest,
		ref,
		className: clsx(
			CreateConditionalClass(disabled, disabledDef, disabledU),
			...CreateClasses(defaultClsx, userClsx),
			className
		),
		children: <>{children}</>,
	};
	return createElement(component, finalProps);
});

export default Card;
