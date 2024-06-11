import { tryDeductFreeMessage } from "~/logic/deductFreeMessage";
import { db } from "~/server/db";
import { openai } from "~/server/open_ai";
import { getUser } from "~/server/token";
import { queryForThreadById } from "~/src/dynamo";

export default defineEventHandler(async (event) => {
  const user = await getUser(event);
  // await tryDeductFreeMessage(user);

  const body = await readBody<{ threadId: string; message: string }>(event);
  const thread = await queryForThreadById(user.email, body.threadId);

  if (!thread) {
    throw new Error(`No thread with id ${body.threadId} found!`);
  }

  console.log(`Creating message: ${body.message} in thread: ${body.threadId}`);
  const message = await openai.beta.threads.messages.create(thread.openai_id, {
    role: "user",
    content: body.message,
  });

  return message;
});
