import { d as defineEventHandler } from '../../../index.mjs';
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
import '../../_/errors.mjs';
import '../../_/nuxtAuthHandler.mjs';
import 'next-auth/core';
import 'next-auth/jwt';

const threads_get = defineEventHandler(async (event) => {
  const user = await getUser(event);
  if (!user) {
    return [];
  }
  const threadsForUser = await db("threads").where({ user_id: user.id }).whereNotNull("summary");
  const all = await Promise.all(
    threadsForUser.map(async (x) => {
      var _a, _b;
      const t = await openai.beta.threads.retrieve(x.openai_id);
      return {
        ...t,
        openai_id: t.id,
        id: x.id.toString(),
        summary: (_b = (_a = x.summary) == null ? void 0 : _a.toString()) != null ? _b : ""
      };
    })
  );
  all.sort((x, y) => x.created_at - y.created_at ? -1 : 1);
  return all;
});

export { threads_get as default };
//# sourceMappingURL=threads.get.mjs.map
