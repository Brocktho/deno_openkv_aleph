/** @format */

import { V2_ServerRuntimeMetaFunction } from "@remix-run/server-runtime";

export const meta: V2_ServerRuntimeMetaFunction = () => {
	return [
		{ title: "Brocktho" },
		{ name: "description", content: "Welcome to my Portfolio Site!" },
	];
};

export default function Index() {
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1 className="text-xl text-center">Hey! Welcome to my website.</h1>
			<h2>
				This page is currently under construction. It should be giving
				you information about who I am, what I do, and some of my
				previous experience.
			</h2>
		</div>
	);
}
