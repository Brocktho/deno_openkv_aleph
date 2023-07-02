/** @format */

import { useEffect } from "preact";

export const useTab = (onTab: (e: KeyboardEvent) => any) => {
	useEffect(() => {
		if (typeof window !== "undefined") {
			const handleTab = (e: KeyboardEvent) => {
				if (e.key === "Tab") {
					onTab(e);
				}
			};
			window.addEventListener("keydown", handleTab);
			return () => {
				window.removeEventListener("keydown", handleTab);
			};
		}
	}, [onTab]);
};
