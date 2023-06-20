/** @format */

import clsx from "clsx";
import React, { createElement, forwardRef, useRef } from "react";

import {
	type ClassOptions,
	CreateClasses,
	CreateConditionalClass,
} from "~/StyleHelpers.ts";
import { BubbleStyles } from "~/components/Accents/Bubble.tsx";
import type {
	DefaultOverridableProps,
	OverridableProps,
} from "../utils/OverridableComponents.ts";
import { useButton, useFocusRing } from "react-aria";
import useForkRef from "~/components/Hooks/useForkRef.tsx";

export interface DefaultButtonProps<D extends React.ElementType = "button">
	extends DefaultOverridableProps<D> {
	active?: boolean;
	clsxs?: ClassOptions;
	disabled?: boolean;
	variant?: ButtonVariants;
	children?: React.ReactNode;
}

export type ButtonProps<D extends React.ElementType = "button"> =
	OverridableProps<D, DefaultButtonProps<D>>;

export const BaseButtonClsxs: ClassOptions = {
	h: "h-10",
	w: "w-auto",
	p: "px-6",
	before: "before:absolute before:w-full before:h-full before:rounded-full",
	rounded: "rounded-full",
	transition: "transition motion-reduce:transition-none",
	duration: "duration-200",
	focus_visible: "focus-visible:outline-none",
	align: "items-center justify-center",
	display: "flex",
	position: "relative",
	focus: "focus:outline-none",
};

export const TextButtonClsxs: ClassOptions = {
	...BaseButtonClsxs,
	text: "text-primary-light dark:text-primary-dark",
	disabled:
		"text-on-surface-light dark:text-on-surface-dark opacity-disabled",
	hover: "before:hover:bg-primary-light before:dark:hover:bg-primary-dark before:hover:opacity-hover",
	focus_visible:
		"focus-visible:outline-none before:focus-visible:bg-primary-light before:dark:focus-visible:bg-primary-dark before:focus-visible:opacity-focus",
	active: "before:active:bg-primary-light before:dark:active:bg-primary-dark before:active:opacity-active",
};
export const TextButtonBubbleClsxs: ClassOptions = {
	focus_visible:
		"after:focus-visible:bg-primary-light after:dark:focus-visible:bg-primary-dark after:focus-visible:opacity-focus",
};

export const ElevatedButtonClsxs: ClassOptions = {
	...BaseButtonClsxs,
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
export const ElevatedButtonBubbleClsxs: ClassOptions = {
	focus_visible:
		"after:focus-visible:bg-primary-light after:dark:focus-visible:bg-primary-dark after:focus-visible:opacity-focus",
};

export const FilledButtonClsxs: ClassOptions = {
	...BaseButtonClsxs,
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
export const FilledButtonBubbleClsxs: ClassOptions = {
	focus_visible:
		"after:focus-visible:bg-on-primary-light after:dark:focus-visible:bg-on-primary-dark after:focus-visible:opacity-focus",
};

export const TonalButtonClsxs: ClassOptions = {
	...BaseButtonClsxs,
	shadow: "shadow-sm",
	bg: "bg-secondary-container-light dark:bg-secondary-container-dark",
	text: "text-on-secondary-container-light dark:text-on-secondary-container-dark",
	disabled:
		"bg-transparent before:bg-on-surface-light before:dark:bg-on-surface-dark text-on-surface-light dark:text-on-surface-dark opacity-disabled before:opacity-active",
	hover: "before:hover:bg-on-secondary-container-light before:dark:hover:bg-on-secondary-container-dark before:hover:shadow before:hover:opacity-hover",
	focus_visible:
		"focus-visible:outline-none before:focus-visible:bg-on-secondary-container-light before:dark:focus-visible:bg-on-secondary-container-dark before:focus-visible:shadow-sm before:focus-visible:opacity-focus",
	active: "before:active:bg-on-secondary-container-light before:dark:active:bg-on-secondary-container-dark before:active:shadow-sm before:active:opacity-active",
};
export const TonalButtonBubbleClsxs: ClassOptions = {
	focus_visible:
		"after:focus-visible:bg-on-secondary-container-light after:dark:focus-visible:bg-on-secondary-container-dark after:focus-visible:opacity-focus",
};

export const OutlinedButtonClsxs: ClassOptions = {
	...BaseButtonClsxs,
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
export const OutlinedButtonBubbleClsxs: ClassOptions = {
	focus_visible:
		"after:focus-visible:bg-primary-light after:dark:focus-visible:bg-primary-dark after:focus-visible:opacity-focus",
};

export type ButtonVariants =
	| "elevated"
	| "filled"
	| "text"
	| "tonal"
	| "outlined";

const Variants: Record<
	ButtonVariants,
	{ button: ClassOptions; bubble: ClassOptions }
> = {
	elevated: {
		button: ElevatedButtonClsxs,
		bubble: ElevatedButtonBubbleClsxs,
	},
	filled: {
		button: FilledButtonClsxs,
		bubble: FilledButtonBubbleClsxs,
	},
	text: {
		button: TextButtonClsxs,
		bubble: TextButtonBubbleClsxs,
	},
	tonal: {
		button: TonalButtonClsxs,
		bubble: TonalButtonBubbleClsxs,
	},
	outlined: {
		button: OutlinedButtonClsxs,
		bubble: OutlinedButtonBubbleClsxs,
	},
};

//export const CanDisable = ["button", "fieldset", "select"];

export const Button = forwardRef(function Button<
	D extends React.ElementType = "button"
>(props: ButtonProps<D>, ref: React.Ref<Element>) {
	const {
		component = "button",
		children,
		clsxs,
		disabled,
		onClick,
		active,
		variant = "text",
		className,
		...rest
	} = props;
	const { button, bubble } = Variants[variant];
	const {
		disabled: disabledUserClsx,
		active: activeUserClsx,
		hover: hoverUserClsx,
		...restUserClsx
	} = clsxs || {};
	const {
		disabled: disabledClsx,
		hover,
		active: activeClsx,
		...restClsx
	} = button;
	const finalProps = {
		...rest,
		ref,
		className: clsx(
			CreateConditionalClass(disabled, disabledClsx, disabledUserClsx),
			CreateConditionalClass(!disabled, hover, hoverUserClsx),
			CreateConditionalClass(!disabled, activeClsx, activeUserClsx),
			...CreateClasses(restClsx, restUserClsx),
			...BubbleStyles(bubble),
			className
		),
		disabled,
		"aria-disabled": disabled,
		// deno-lint-ignore no-explicit-any
		onClick: (e: any) => {
			if (disabled) {
				e.preventDefault();
				return;
			}
			onClick && onClick(e);
		},
		children: (
			<>
				{children}
				<span className={"absolute inset-0 overflow-hidden"}></span>
			</>
		),
	};
	return createElement(component, finalProps);
});

export default Button;
