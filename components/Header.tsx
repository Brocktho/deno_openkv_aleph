/** @format */

import { NavLink } from "aleph/react";
import { useEffect } from "react";
import { useTransition, animated } from "react-spring";

export default function Header() {
	const [transitions, api] = useTransition(true, () => ({
		from: { opacity: 1, transform: "translateY(0%)" },
		enter: { opacity: 1, transform: "translateY(0%)" },
		leave: { opacity: 1, transform: "translateY(0%)" },
	}));
	useEffect(() => {
		api.start();
	});
	const active_style = "underline text-red-300";
	return transitions((styles, item) => (
		<animated.header
			style={styles}
			className="shadow-xl bg-white sticky top-0 w-full h-20 p-3 flex flex-row items-center justify-between z-50">
			<div>Logo</div>
			<div className="flex flex-row gap-3">
				<NavLink activeClassName={active_style} to="/#about">
					About
				</NavLink>
				<NavLink activeClassName={active_style} to="/blog">
					Blog
				</NavLink>
				<NavLink activeClassName={active_style} to="/todos">
					Todos
				</NavLink>
			</div>
			<div>Login</div>
		</animated.header>
	));
}
