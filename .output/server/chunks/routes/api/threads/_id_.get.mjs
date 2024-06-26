import { d as defineEventHandler, g as getRouterParam } from '../../../runtime.mjs';
import { o as openai } from '../../../_/open_ai.mjs';
import { g as getUser } from '../../../_/token.mjs';
import { b as queryForThreadById } from '../../../_/dynamo.mjs';
import 'node:http';
import 'node:https';
import 'node:crypto';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'openai';
import '../../../_/errors.mjs';
import '@aws-sdk/client-dynamodb';
import '@aws-sdk/util-dynamodb';

const _id__get = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const user = await getUser(event);
  const thread = await queryForThreadById(user.email, id);
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
  return {
    messages: threadMessages.data.reverse(),
    summary: thread.summary
  };
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
