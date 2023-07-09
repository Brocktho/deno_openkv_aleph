/** @format */

import clsx from "clsx";
import * as React from "react";
import {
  type ClassOptions,
  CreateClasses,
  CreateConditionalClass,
} from "../../StyleHelpers.ts";
import type {
  DefaultOverridableProps,
  OverridableProps,
} from "../utils/OverridableComponents.ts";

export interface DefaultCardProps<D extends React.ElementType = "section">
  extends DefaultOverridableProps<D> {
  interactable?: boolean;
  clsxs?: ClassOptions;
  variant?: CardVariants;
  disabled?: boolean;
  children?: React.ReactNode;
}

export type CardProps<D extends React.ElementType = "section"> =
  OverridableProps<D, DefaultCardProps<D>>;

//TODO: Make Draggable state, probably want to set a z-index on this element when dragging. Maybe make a z-index across all items based on elevation?
// Definitely want to keep it as a low value for all z-index stuff, it can be annoying otherwise.

export const BaseCardClsxs: ClassOptions = {
  h: "h-auto",
  w: "w-auto",
  p: "p-3",
  before:
    "before:absolute before:w-full before:h-full before:rounded-xl before:z-[1] before:top-0 before:left-0",
  rounded: "rounded-xl",
  transition: "transition motion-reduce:transition-none",
  duration: "duration-200",
  align: "items-center",
  display: "flex flex-col",
  gap: "gap-3",
  position: "relative",
};

export const ElevatedCardClsxs: ClassOptions = {
  ...BaseCardClsxs,
  shadow: "shadow",
  bg: "bg-surface-light dark:bg-surface-dark",
  disabled:
    "disabled:shadow-md dark:text-on-surface-dark opacity-disabled before:opacity-active",
  hover:
    "before:hover:bg-on-surface-light before:dark:hover:bg-on-surface-dark before:hover:opacity-hover hover:shadow-md",
  focus_visible:
    "focus-visible:shadow focus-visible:outline-none before:focus-visible:bg-on-surface-light before:dark:focus-visible:bg-on-surface-dark before:focus-visible:opacity-focus",
  active:
    "focus-visible:shadow before:active:bg-on-surface-light before:dark:active:bg-on-surface-dark before:active:opacity-active",
};

export const FilledCardClsxs: ClassOptions = {
  ...BaseCardClsxs,
  shadow: "shadow-sm",
  bg: "light:bg-primary-light dark:bg-primary-dark",
  disabled:
    "bg-transparent before:light:bg-on-surface-light before:dark:bg-on-surface-dark text-on-surface-light dark:text-on-surface-dark opacity-disabled before:opacity-active",
  hover:
    "before:light:hover:bg-on-primary-light before:dark:hover:bg-on-primary-dark before:hover:shadow before:hover:opacity-hover",
  focus_visible:
    "focus-visible:outline-none before:light:focus-visible:bg-on-primary-light before:dark:focus-visible:bg-on-primary-dark before:focus-visible:shadow-sm before:focus-visible:opacity-focus",
  active:
    "before:light:active:bg-on-primary-light before:dark:active:bg-on-primary-dark before:active:shadow-sm before:active:opacity-active",
};

export const OutlinedCardClsxs: ClassOptions = {
  ...BaseCardClsxs,
  bg: "light:bg-surface-light dark:bg-surface-dark",
  shadow: "shadow",
  border: "border light:border-outline-light dark:border-outline-dark",
  hover:
    "before:hover:shadow-inner before: before:hover:bg-primary-light before:dark:hover:bg-primary-dark before:hover:opacity-hover",
  focus_visible:
    "focus-visible:outline-none before:focus-visible:bg-primary-light before:dark:focus-visible:bg-primary-dark before:focus-visible:opacity-focus",
  active:
    "before:active:w-full before:active:bg-primary-light before:dark:active:bg-primary-dark before:active:opacity-active",
  disabled:
    "border-on-surface-light dark:border-on-surface-dark text-on-surface-light dark:text-on-surface-dark opacity-disabled",
};

export type CardVariants = "elevated" | "filled" | "outlined";

const Variants: Record<CardVariants, ClassOptions> = {
  elevated: ElevatedCardClsxs,
  filled: FilledCardClsxs,
  outlined: OutlinedCardClsxs,
};

export const Card = React.forwardRef(function Card<
  D extends React.ElementType = "section",
>(props: CardProps<D>, ref: React.Ref<Element>) {
  const {
    component = "section",
    children,
    clsxs,
    disabled,
    variant = "elevated",
    interactable = false,
    className,
    ...rest
  } = props;
  const {
    disabled: disabledU,
    hover: hoverU,
    before: beforeU,
    active: activeU,
    ...userClsx
  } = clsxs || {};
  const {
    disabled: disabledDef,
    hover: hoverDef,
    before: beforeDef,
    active: activeDef,
    ...defaultClsx
  } = Variants[variant];
  const finalProps = {
    ...rest,
    ref,
    tabIndex: interactable ? 0 : -1,
    className: clsx(
      CreateConditionalClass(interactable, beforeDef, beforeU),
      CreateConditionalClass(interactable, hoverDef, hoverU),
      CreateConditionalClass(interactable, activeDef, activeU),
      CreateConditionalClass(disabled, disabledDef, disabledU),
      ...CreateClasses(defaultClsx, userClsx),
      className,
    ),
    children: <>{children}</>,
  };
  return React.createElement(component, finalProps);
});

export default Card;
