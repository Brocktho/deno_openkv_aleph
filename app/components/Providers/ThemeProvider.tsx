/** @format */

import React from "react";

export type MaterialWindThemeContext = "";

const MaterialWindContext = React.createContext<
  MaterialWindThemeContext | undefined
>(undefined);

/**
 * @description
 *
 * This is basically a docs file at this point. Not sure how I want to manage context if at all.
 *
 * @external documentation for helping with color palette choices:
 *
 * Part of Material's styles is an elevation, to mimic elevation without too much headache,
 *
 * level 0 = shadow-sm
 *
 * level 1 = shadow
 *
 * level 2 = shadow-md
 *
 * level 3 = shadow-lg
 *
 * level 4 = shadow-xl
 *
 * level 5 = shadow-2xl
 *
 * [Material UI's Docs on Color Palette](https://m3.material.io/styles/color/the-color-system/key-colors-tones)
 *
 * [Material Theme Builder](https://m3.material.io/theme-builder#/custom)
 *
 * [Color Picker](https://coolors.co/)
 *
 * @returns
 */
export const MaterialWindThemeProvider = () => {
  return <MaterialWindContext.Provider value=""></MaterialWindContext.Provider>;
};
