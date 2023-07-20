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
import * as React from "react";
import { asset, css } from "../assets.ts";
import Header from "./components/Header.tsx";
import Keywords from "./Keywords.ts";
import GenericError from "./Helpers/Errors.tsx";
import { LinksFunction } from "@remix-run/deno";

const tailwind = asset("../assets/theme.css", css);

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
