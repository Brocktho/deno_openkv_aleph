/** @format */

import clsx from "clsx";
import React from "preact";
import {
	type ClassOptions,
	CreateClasses,
	CreateConditionalClass,
} from "~/StyleHelpers.ts";
import { BubbleStyles } from "~/components/Accents/Bubble.tsx";
import { useButton, useFocusRing } from "react-aria";
import useForkRef from "~/components/Hooks/useForkRef.tsx";
import type {
	DefaultOverridableProps,
	OverridableProps,
} from "~/components/utils/OverridableComponents.ts";

export interface DefaultFABProps<D extends React.ElementType = "button">
	extends DefaultOverridableProps<D> {
	active?: boolean;
	clsxs?: ClassOptions;
	variant?: FABVariants;
	children?: React.ReactNode;
}
export type FABProps<D extends React.ElementType = "button"> = OverridableProps<
	D,
	DefaultFABProps<D>
>;

export type FABVariants = "small" | "large" | "default";

// Should have a spacing of 1rem from each side of the screen according to the design
const FABBaseClsx: ClassOptions = {
	shadow: "shadow-md",
	rounded: "rounded-xl",
	display: "flex",
	position: "relative",
	overflow: "overflow-hidden",
	align: "items-center justify-center",
	before: "before:w-full before:h-full before:rounded-xl before:absolute",
	bg: "bg-primary-container-light dark:bg-primary-container-dark",
	text: "text-on-primary-container-light dark:text-on-primary-container-dark",
	hover: "hover:shadow-lg before:hover:opacity-hover before:hover:bg-on-primary-container-light before:dark:hover:bg-on-primary-container-dark",
	focus_visible:
		"focus-visible:outline-none before:focus-visible:shadow-sm before:focus-visible:opacity-focus before:focus-visible:bg-on-primary-container-light before:dark:focus-visible:bg-on-primary-container-dark",
	active: "before:active:opacity-active before:active:bg-on-primary-container-light before:dark:active:bg-on-primary-container-dark",
	focus: "focus:outline-none",
	//margin: "m-4"
};
const FABBubbleClsx: ClassOptions = {
	focus_visible:
		"after:focus-visible:bg-on-primary-container-light after:dark:focus-visible:bg-on-primary-container-dark after:focus-visible:opacity-focus",
};

const FABClsx: ClassOptions = {
	...FABBaseClsx,
	w: "w-14",
	h: "h-14",
};

const SmallFABClsx: ClassOptions = {
	...FABBaseClsx,
	w: "w-10",
	h: "h-10",
};

const LargeFABClsx: ClassOptions = {
	...FABBaseClsx,
	w: "w-24",
	h: "h-24",
};

const FABVariantClsx: Record<FABVariants, ClassOptions> = {
	default: FABClsx,
	small: SmallFABClsx,
	large: LargeFABClsx,
};

/**
 * A floating action button component.
 *
 * @param {FABProps} props - The props for the FAB component.
 * @param {React.Ref<Element>} ref - The ref for the FAB button.
 * @returns {JSX.Element} - A FAB button.
 *
 * @example
 * <FAB onClick={handleClick}> <AddIcon/> </FAB>
 */
const FAB = React.forwardRef(function FAB<
	D extends React.ElementType = "button"
>(props: FABProps<D>, ref: React.Ref<D>) {
	const ariaRef = React.useRef(null);
	const {
		component = "button",
		clsxs,
		className,
		variant = "default",
		children,
		icon,
		...rest
	} = props;
	const { buttonProps, isPressed } = useButton(
		{ ...rest, elementType: component },
		ariaRef
	);
	const { isFocusVisible, focusProps } = useFocusRing();
	const handleRef = useForkRef(ref, ariaRef);
	const thisVariant = FABVariantClsx[variant];
	const {
		active: activeUserClsx,
		focus_visible: focusVisibleUserClsx,
		...userClsx
	} = clsxs ?? {};
	const {
		active: activeClsx,
		focus_visible: focusVisibleClsx,
		...defaultClsx
	} = thisVariant;
	const finalProps = {
		...buttonProps,
		...focusProps,
		ref: handleRef,
		className: clsx(
			CreateConditionalClass(isPressed, activeClsx, activeUserClsx),
			CreateConditionalClass(
				isFocusVisible,
				focusVisibleClsx,
				focusVisibleUserClsx
			),
			...CreateClasses(defaultClsx, userClsx),
			[isFocusVisible && BubbleStyles(FABBubbleClsx)],
			className
		),
		children: (
			<>
				<span className="w-6 h-6 overflow-hidden">{children}</span>
			</>
		),
	};
	return React.createElement(component, finalProps);
});

export default FAB;
