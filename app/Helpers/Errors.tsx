/** @format */

import React from "react";
import { useRouteError, isRouteErrorResponse } from "@remix-run/react";
import Card from "../components/Cards/index.tsx";

const GenericError = () => {
	const error = useRouteError();
	if (isRouteErrorResponse(error)) {
		// TODO: Handle errors.
	}

	return (
		<Card clsxs={{ w: "w-full", h: "h-full" }}>
			<h1>Uh-oh! Nobody look!</h1>
		</Card>
	);
};

export default GenericError;
