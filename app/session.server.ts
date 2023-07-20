/** @format */
import { createCookieSessionStorage } from "https://esm.sh/@remix-run/deno@1.18.1";
import { RequireSecret } from "./Helpers/Secrets.ts";

const SESSION_SECRET = RequireSecret("SESSION_SECRET");
export const user_key = "user_id";

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      secrets: [SESSION_SECRET],
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
  id: string,
) => {
  session.set(user_key, id);
  return session;
};
