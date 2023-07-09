/** @format */

import invariant from "tiny-invariant";

export const RequiredParam = (
	params: Record<string, string | undefined>,
	key: string
) => {
	const param = params[key];
	invariant(param, `${key} is not set`);
	return param;
};
