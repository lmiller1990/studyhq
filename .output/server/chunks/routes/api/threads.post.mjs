import { d as defineEventHandler } from '../../runtime.mjs';
import nodeCrypto from 'node:crypto';
import { U as UnauthorizedError } from '../../_/errors.mjs';
import { o as openai } from '../../_/open_ai.mjs';
import { g as getUser } from '../../_/token.mjs';
import { e as insertThread, s as skToId } from '../../_/dynamo.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'openai';
import '@aws-sdk/client-dynamodb';
import '@aws-sdk/util-dynamodb';

const threads_post = defineEventHandler(async (event) => {
  const user = await getUser(event);
  if (!user) {
    throw new UnauthorizedError();
  }
  const emptyThread = await openai.beta.threads.create();
  const sk = `thread#${nodeCrypto.randomUUID()}`;
  await insertThread(user.email, sk, emptyThread.id);
  return {
    id: skToId(sk),
    openai_id: emptyThread.id,
    created_at: emptyThread.created_at
  };
});

export { threads_post as default };
//# sourceMappingURL=threads.post.mjs.map
