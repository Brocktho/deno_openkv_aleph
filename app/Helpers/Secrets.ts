/** @format */

import invariant from "tiny-invariant";

export const RequireSecret = (secret_key: string) => {
	const secret = Deno.env.get(secret_key);
	if (Deno.env.get("ENV") === "production") {
		invariant(secret, `${secret} is not set`);
	}
	return secret || window.crypto.randomUUID();
};
