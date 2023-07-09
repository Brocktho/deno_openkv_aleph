/** @format */

import invariant from "tiny-invariant";

export const RequireSecret = (secret_key: string) => {
	const secret = Deno.env.get(secret_key);
	invariant(secret, `${secret} is not set`);
	return secret;
};
