/** @format */

import { Head } from "$fresh/runtime.ts";
import type { ComponentChildren } from "preact";
import Header from "../islands/Header.tsx";

const Route = ({ children }: { children: ComponentChildren }) => {
	return (
		<div className="min-h-screen w-screen ">
			<Head>
				<title>Brock's Blog</title>
				<link href="/styles.css" rel="stylesheet" />
			</Head>
			<Header />
			{children}
		</div>
	);
};

export default Route;
