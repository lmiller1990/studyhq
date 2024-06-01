import { db } from "~/server/db";
import { openai } from "~/server/open_ai";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const thread = await db("threads").where({ id }).first();

  if (!thread) {
    throw new Error(`No thread with id ${id} found!`);
  }

  const threadMessages = await openai.beta.threads.messages.list(
    thread.openai_id,
    {
      limit: 5,
      order: "desc",
    },
  );

  return threadMessages.data.reverse();
});
