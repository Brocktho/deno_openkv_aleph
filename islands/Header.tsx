/** @format */

import { useEffect } from "preact/compat";
import { animated, useTransition } from "react-spring";

export default function Header() {
	const [transitions, api] = useTransition(true, () => ({
		from: { opacity: 0, transform: "translateY(-50%)" },
		enter: { opacity: 1, transform: "translateY(0%)" },
		leave: { opacity: 0, transform: "translateY(-50%)" },
	}));
	useEffect(() => {
		console.log("start");
		api.start();
	}, []);
	const active_style = "underline text-red-300";
	return transitions((styles, item) => (
		<animated.header
			style={styles}
			className="shadow-xl bg-white sticky top-0 w-full h-20 p-3 flex flex-row items-center justify-between z-50">
			<div>Logo</div>
			<div className="flex flex-row gap-3">
				<a href="/#about">About</a>
				<a href="/blog">Blog</a>
				<a href="/todos">Todos</a>
			</div>
			<div>Login</div>
		</animated.header>
	));
}
