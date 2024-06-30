import crypto from "node:crypto";
import { openai } from "~/server/open_ai";
import { getUser } from "~/server/token";
import { insertThread, skToId } from "~/src/dynamo";

export default defineEventHandler(async (event) => {
  const user = await getUser(event);

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
