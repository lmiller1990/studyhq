import { tryDeductFreeMessage } from "~/logic/deductFreeMessage";
import { db } from "~/server/db";
import { openai } from "~/server/open_ai";
import { getUser } from "~/server/token";

export default defineEventHandler(async (event) => {
  const user = await getUser(event);
  await tryDeductFreeMessage(user);

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

  return message;
});
