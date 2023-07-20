/** @format */

import { ReactNode } from "react";
import Card, { CardProps } from "../Cards/index.tsx";
import {
  DefaultOverridableProps,
  OverridableProps,
} from "../utils/OverridableComponents.ts";

export interface DefaultModalProps<D extends React.ElementType = "section">
  extends DefaultOverridableProps<D> {
  children?: React.ReactNode;
  card?: Omit<CardProps<D>, "children">;
  open: boolean;
}

export type ModalProps<D extends React.ElementType = "section"> =
  OverridableProps<D, DefaultModalProps<D>>;

const Modal = <D extends React.ElementType = "section">(
  props: ModalProps<D>,
) => {
  const { children, card, component = "section", open } = props;
  return open
    ? (
      <>
        <div className="w-screen h-screen fixed top-0 left-0 bg-slate-500 opacity-25 z-20">
        </div>
        <div className="w-screen h-screen fixed top-0 left-0 z-30 flex flex-col items-center justify-center">
          <Card {...card} component={component}>
            {children}
          </Card>
        </div>
      </>
    )
    : <></>;
};

export default Modal;
