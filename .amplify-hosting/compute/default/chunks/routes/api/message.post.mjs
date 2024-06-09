import { d as defineEventHandler, r as readBody } from '../../../index.mjs';
import { t as tryDeductFreeMessage } from '../../_/deductFreeMessage.mjs';
import { d as db } from '../../_/db.mjs';
import { o as openai } from '../../_/open_ai.mjs';
import { g as getUser } from '../../_/token.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'requrl';
import 'node:fs';
import 'node:url';
import '../../_/errors.mjs';
import 'knex';
import 'openai';
import '../../_/nuxtAuthHandler.mjs';
import 'next-auth/core';
import 'next-auth/jwt';

const message_post = defineEventHandler(async (event) => {
  const user = await getUser(event);
  await tryDeductFreeMessage(user);
  const body = await readBody(event);
  const thread = await db("threads").where({ id: body.threadId }).first();
  if (!thread) {
    throw new Error(`No thread with id ${body.threadId} found!`);
  }
  console.log(`Creating message: ${body.message} in thread: ${body.threadId}`);
  const message = await openai.beta.threads.messages.create(thread.openai_id, {
    role: "user",
    content: body.message
  });
  return message;
});

export { message_post as default };
//# sourceMappingURL=message.post.mjs.map
