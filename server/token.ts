import type { H3Event, EventHandlerRequest } from "h3";
import { getToken } from "#auth";
import { db } from "~/server/db";
import { ImpossibleCodeError, UnauthorizedError } from "~/logic/errors";
import { DBUser } from "~/logic/dbTypes";

/**
 * @returns User email if found in token
 */
export async function getUser(
  event: H3Event<EventHandlerRequest>,
): Promise<DBUser> {
  const t = await getToken({
    event,
    cookieName: "studymate-auth.session-token",
  });

  if (!t?.email) {
    throw new UnauthorizedError();
  }

  // check db
  const exists = await db("users").where({ email: t.email }).first();

  if (exists) {
    return {
      ...exists,
      id: exists.id as number,
      email: exists.email as string,
      credit: exists.credit as number,
    };
  }

  throw new ImpossibleCodeError(
    `User with matching email: ${t.email} not found`,
  );
}
