import type { H3Event, EventHandlerRequest } from "h3";
import { UnauthorizedError } from "~/logic/errors";
import { DynamoSchema } from "~/logic/dbTypes";
import { queryForUser } from "~/src/dynamo";

/**
 * @returns User email if found in token
 */
export async function getUser(
  event: H3Event<EventHandlerRequest>,
): Promise<DynamoSchema["User"]> {
  const session = await getUserSession(event);

  // @ts-ignore
  if (!session.user?.email) {
    throw new UnauthorizedError();
  }

  // check db
  // @ts-ignore
  return await queryForUser(session.user.email);
}
