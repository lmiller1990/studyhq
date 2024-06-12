import type { H3Event, EventHandlerRequest } from "h3";
import { getToken } from "#auth";
import { ImpossibleCodeError, UnauthorizedError } from "~/logic/errors";
import { DynamoSchema } from "~/logic/dbTypes";
import { queryForUser } from "~/src/dynamo";

/**
 * @returns User email if found in token
 */
export async function getUser(
  event: H3Event<EventHandlerRequest>,
): Promise<DynamoSchema["User"]> {
  const t = await getToken({
    event,
    cookieName: "studymate-auth.session-token",
  });

  if (!t?.email) {
    throw new UnauthorizedError();
  }

  // check db
  return await queryForUser(t.email);
}
