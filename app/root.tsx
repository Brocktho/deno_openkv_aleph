/** @format */

import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	V2_MetaFunction,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/deno";
import * as React from "react";
// @ts-ignore - Tailwind import with remix, this is valid.
import tailwind from "./theme.css";
import Header from "./components/Header.tsx";
import Keywords from "./Keywords.ts";
import GenericError from "./Helpers/Errors.tsx";

export const meta: V2_MetaFunction = () => [
	{ name: "keywords", content: Keywords },
];

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: tailwind },
];

export default function App() {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1"
				/>
				<meta name="robots" content="index, follow" />
				<meta name="language" content="English" />
				<meta name="author" content="Brock Donahue" />
				<Meta />
				<Links />
			</head>
			<body>
				<Header />
				<div className="w-screen min-h-screen mt-3">
					<Outlet />
				</div>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}

export const ErrorBoundary = () => {
	return <GenericError />;
};
