import type { H3Event, EventHandlerRequest } from "h3";
import { getToken } from "#auth";
import { db } from "~/server/db";

/**
 * @returns User email if found in token
 */
export async function maybeGetUser(event: H3Event<EventHandlerRequest>) {
  const t = await getToken({
    event,
    cookieName: "studymate-auth.session-token",
  });

  if (!t?.email) {
    // guest
    return null;
  }

  // check db
  const exists = await db("users").where({ email: t.email }).first();
  if (exists) {
    return { id: exists.id as number, email: exists.email as string };
  }

  // how??
  return null;
}
