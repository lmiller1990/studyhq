import { db } from "~/server/db";
import { openai } from "~/server/open_ai";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ threadId: string; message: string }>(event);
  const thread = await db("threads").where({ id: body.threadId }).first();

  if (!thread) {
    throw new Error(`No thread with id ${body.threadId} found!`);
  }

  // const t = await openai.beta.threads.retrieve(thread.openai_id);
  console.log(`Creating message: ${body.message} in thread: ${body.threadId}`);
  const message = await openai.beta.threads.messages.create(thread.openai_id, {
    role: "user",
    content: body.message,
  });

  console.log(message);
  return message;
});
