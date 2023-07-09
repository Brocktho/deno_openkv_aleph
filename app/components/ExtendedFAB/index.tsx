/** @format */

import clsx from "clsx";
import React, { useRef } from "react";
import {
  type ClassOptions,
  CreateClasses,
  CreateConditionalClass,
} from "../../StyleHelpers.ts";
import { BubbleStyles } from "../../components/Accents/Bubble.tsx";
import type {
  DefaultOverridableProps,
  OverridableProps,
} from "../../components/utils/OverridableComponents.ts";

export interface DefaultFABProps<D extends React.ElementType = "button">
  extends DefaultOverridableProps<D> {
  active?: boolean;
  clsxs?: ClassOptions;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}
export type FABProps<D extends React.ElementType = "button"> = OverridableProps<
  D,
  DefaultFABProps<D>
>;

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
  hover:
    "hover:shadow-lg before:hover:opacity-hover before:hover:bg-on-primary-container-light before:dark:hover:bg-on-primary-container-dark",
  focus_visible:
    "focus-visible:outline-none before:focus-visible:shadow-sm before:focus-visible:opacity-focus before:focus-visible:bg-on-primary-container-light before:dark:focus-visible:bg-on-primary-container-dark",
  active:
    "before:active:opacity-active before:active:bg-on-primary-container-light before:dark:active:bg-on-primary-container-dark",
  p: "p-4",
  gap: "gap-4",
  focus: "focus:outline-none",
  //margin: "m-4"
};
const FABBubbleClsx: ClassOptions = {
  focus_visible:
    "after:focus-visible:bg-on-primary-container-light after:dark:focus-visible:bg-on-primary-container-dark after:focus-visible:opacity-focus",
};

const ExtendedFABClsx: ClassOptions = {
  ...FABBaseClsx,
  w: "min-w-[5rem]",
  h: "h-14",
};

const ExtendedFAB = React.forwardRef(function ExtendedFAB<
  D extends React.ElementType = "button",
>(props: FABProps<D>, ref: React.Ref<D>) {
  const {
    component = "button",
    clsxs,
    className,
    children,
    icon,
    ...rest
  } = props;
  const finalProps = {
    ...rest,
    ref,
    className: clsx(
      ...CreateClasses(ExtendedFABClsx, clsxs),
      BubbleStyles(FABBubbleClsx),
      className,
    ),
    children: (
      <>
        <span className="w-6 h-6 overflow-hidden">{icon}</span>
        <span>{children}</span>
      </>
    ),
  };

  return React.createElement(component, finalProps);
});

export default ExtendedFAB;
