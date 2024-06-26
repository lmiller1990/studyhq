import crypto from "node:crypto";
import { UnauthorizedError } from "~/logic/errors";
import { openai } from "~/server/open_ai";
import { getUser } from "~/server/token";
import { getSummary } from "~/services/summary";
import { insertThread, skToId } from "~/src/dynamo";

export default defineEventHandler(async (event) => {
  const user = await getUser(event);

  if (!user) {
    throw new UnauthorizedError();
  }

  const emptyThread = await openai.beta.threads.create();
  const sk = `thread#${crypto.randomUUID()}`;

  // getSummary(parsed.firstMessage).then((summary) => {

  await insertThread(user.email, sk, emptyThread.id);

  return {
    id: skToId(sk),
    openai_id: emptyThread.id,
    created_at: emptyThread.created_at,
  };
});
