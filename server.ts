/** @format */

import { serve } from "aleph/server";
import denoDeploy from "aleph/plugins/deploy";
import react from "aleph/plugins/react";
import unocss from "aleph/plugins/unocss";
import config from "~/unocss.config.ts";
import modules from "~/routes/_export.ts";
import { createCookieSessionStorage } from "remix-deno";
import { load } from "std/dotenv/mod.ts";

const env = await load();

export const user_key = "user_id";

export const { getSession, commitSession, destroySession } =
	createCookieSessionStorage({
		cookie: {
			name: "__session",
			maxAge: 60 * 60 * 24 * 365,
			sameSite: "lax",
			secrets: [env.SESSION_SECRET],
			secure: false,
		},
	});

export const UserSession = async (req: Request) => {
	const session = await getSession(req.headers.get("Cookie"));
	return session;
};

export const RequireUserId = async (req: Request) => {
	const session = await UserSession(req);
	const user: string | null = session.get(user_key);
	if (!user) {
		throw new Error("User not found");
	}
	return user;
};

export const SetUser = (
	session: Awaited<ReturnType<typeof UserSession>>,
	id: string
) => {
	session.set(user_key, id);
	return session;
};

serve({
	plugins: [denoDeploy({ modules }), react({ ssr: true }), unocss(config)],
});
