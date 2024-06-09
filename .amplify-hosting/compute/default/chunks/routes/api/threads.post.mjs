import { d as defineEventHandler } from '../../../index.mjs';
import { U as UnauthorizedError } from '../../_/errors.mjs';
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
import 'knex';
import 'openai';
import '../../_/nuxtAuthHandler.mjs';
import 'next-auth/core';
import 'next-auth/jwt';

const threads_post = defineEventHandler(async (event) => {
  const user = await getUser(event);
  if (!user) {
    throw new UnauthorizedError();
  }
  const emptyThread = await openai.beta.threads.create();
  const dbThread = await db("threads").insert({ openai_id: emptyThread.id, user_id: user.id }).returning("*");
  return {
    id: dbThread[0].id.toString(),
    openai_id: emptyThread.id,
    created_at: emptyThread.created_at
  };
});

export { threads_post as default };
//# sourceMappingURL=threads.post.mjs.map
