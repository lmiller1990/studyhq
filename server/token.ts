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
  const exists = await queryForUser(t.email);

  if (exists) {
    return {
      email: exists.pk.S!,
      sk: exists.sk.S! as "PROFILE",
      credit: Number(exists.credit.N ?? 0),
    };
  }

  throw new ImpossibleCodeError(
    `User with matching email: ${t.email} not found`,
  );
}
