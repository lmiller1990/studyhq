import { d as defineEventHandler, g as getRouterParam } from '../../../../index.mjs';
import { d as db } from '../../../_/db.mjs';
import { o as openai } from '../../../_/open_ai.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'requrl';
import 'node:fs';
import 'node:url';
import 'knex';
import 'openai';

const _id__get = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const thread = await db("threads").where({ id }).first();
  if (!thread) {
    throw new Error(`No thread with id ${id} found!`);
  }
  const threadMessages = await openai.beta.threads.messages.list(
    thread.openai_id,
    {
      limit: 5,
      order: "desc"
    }
  );
  return threadMessages.data.reverse();
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
