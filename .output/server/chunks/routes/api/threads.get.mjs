import { d as defineEventHandler } from '../../runtime.mjs';
import { o as openai } from '../../_/open_ai.mjs';
import { g as getUser } from '../../_/token.mjs';
import { d as queryForThreadsByUser } from '../../_/dynamo.mjs';
import 'node:http';
import 'node:https';
import 'node:crypto';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'openai';
import '../../_/errors.mjs';
import '@aws-sdk/client-dynamodb';
import '@aws-sdk/util-dynamodb';

const threads_get = defineEventHandler(async (event) => {
  const user = await getUser(event);
  if (!user) {
    return [];
  }
  const threadsForUser = await queryForThreadsByUser(user.email);
  const all = await Promise.all(
    threadsForUser.map(async (x) => {
      const id = x.sk.split("#")[1];
      const t = await openai.beta.threads.retrieve(x.openai_id);
      return {
        ...t,
        openai_id: t.id,
        id,
        summary: x.summary
      };
    })
  );
  all.sort((x, y) => x.created_at < y.created_at ? 1 : -1);
  return all;
});

export { threads_get as default };
//# sourceMappingURL=threads.get.mjs.map
