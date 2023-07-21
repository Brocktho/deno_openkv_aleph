/** @format */

import { useEffect } from "react";
import { animated, useTransition } from "@react-spring/web";
import { NavLink } from "@remix-run/react";

export default function Header() {
	const [transition, api] = useTransition(true, () => ({
		from: { opacity: 1 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
	}));
	const active_style = "underline text-red-300";
	useEffect(() => {
		api.start();
	}, []);
	return transition((style, item) => (
		<animated.header
			style={style}
			className="shadow-xl bg-white sticky top-0 w-full h-20 p-3 flex flex-row items-center justify-between z-50">
			<div>Logo</div>
			<div className="flex flex-row gap-3">
				<NavLink to="/#about">About</NavLink>
				<NavLink to="/blog">Blog</NavLink>
				<NavLink to="/todos">Todos</NavLink>
			</div>
			<div>Login</div>
		</animated.header>
	));
}
