/** @format */

import { Head } from "aleph/react";

export default function Index() {
	return (
		<div className="w-screen flex flex-col items-center min-h-screen gap-3 mt-3">
			<Head>
				<title>Brocktho</title>
				<meta
					name="description"
					content="A personal website for Brock Donahue."
				/>
			</Head>
			<h1 className="text-xl text-center">Hey! Welcome to my website.</h1>
			<h2>
				This page is currently under construction. It should be giving
				you information about who I am, what I do, and some of my
				previous experience.
			</h2>
		</div>
	);
}
