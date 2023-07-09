/** @format */

import { useEffect } from "react";

export const useTab = (onTab: (e: KeyboardEvent) => any) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleTab = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          onTab(e);
        }
      };
      self.addEventListener("keydown", handleTab);
      return () => {
        self.removeEventListener("keydown", handleTab);
      };
    }
  }, [onTab]);
};
