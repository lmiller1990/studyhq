import { UnauthorizedError } from "~/logic/errors";
import { db } from "~/server/db";
import { openai } from "~/server/open_ai";
import { getUser } from "~/server/token";

export default defineEventHandler(async (event) => {
  const user = await getUser(event);

  if (!user) {
    throw new UnauthorizedError();
  }

  const emptyThread = await openai.beta.threads.create();
  const dbThread = await db("threads")
    .insert({ openai_id: emptyThread.id, user_id: user.id })
    .returning("*");

  return {
    id: (dbThread[0].id as number).toString(),
    openai_id: emptyThread.id,
    created_at: emptyThread.created_at,
  };
});
