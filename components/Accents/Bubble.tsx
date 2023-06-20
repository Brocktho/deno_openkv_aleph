/** @format */

import { type ClassOptions, CreateClasses } from "~/StyleHelpers.ts";

export const BubbleStyles = (user_classes?: ClassOptions) =>
	CreateClasses(
		{
			position: "after:absolute",
			w: "after:w-4/5",
			h: "after:h-full",
			rounded: "after:rounded-full",
			animate: "focus-visible:motion-safe:after:animate-pulsing ",
			bg: "after:focus-visible:bg-primary-light after:focus-visible:dark:bg-primary-dark after:focus-visible:opacity-focus",
		},
		user_classes
	);

const Bubble = ({ width, height }: { width: number; height: number }) => {
	return (
		<span
			style={{ width, height }}
			className="animate-pulsing rounded-full bg-light-focus-primary dark:bg-dark-focus-primary"></span>
	);
};

export default Bubble;
