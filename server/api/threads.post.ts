import { db } from "~/server/db";
import { openai } from "~/server/open_ai";
import { maybeGetUser } from "~/server/token";

export default defineEventHandler(async (event) => {
  const user = await maybeGetUser(event);
  console.log("user =>", user);

  if (!user) {
    return;
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
