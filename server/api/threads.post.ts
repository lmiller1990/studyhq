import { db } from "~/server/db";
import { openai } from "~/server/open_ai";

export default defineEventHandler(async (event) => {
  const emptyThread = await openai.beta.threads.create();
  const dbThread = await db("threads")
    .insert({ openai_id: emptyThread.id, user_id: 1 })
    .returning("*");

  return {
    id: (dbThread[0].id as number).toString(),
    openai_id: emptyThread.id,
    created_at: emptyThread.created_at,
  };
});
