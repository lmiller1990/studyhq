import { d as defineEventHandler, r as readBody } from '../../runtime.mjs';
import { g as getUser } from '../../_/token.mjs';
import { g as getSummary } from '../../_/summary.mjs';
import { c as updateThreadSummary } from '../../_/dynamo.mjs';
import 'node:http';
import 'node:https';
import 'node:crypto';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import '../../_/errors.mjs';
import '../../_/open_ai.mjs';
import 'openai';
import '../../_/shared.mjs';
import '@aws-sdk/client-dynamodb';
import '@aws-sdk/util-dynamodb';

const summary_post = defineEventHandler(async (event) => {
  const user = await getUser(event);
  const body = await readBody(event);
  const summary = await getSummary(body.message);
  await updateThreadSummary(user.email, body.threadId, summary);
  console.log(`Summary for ${body.message} is ${summary}`);
  return {};
});

export { summary_post as default };
//# sourceMappingURL=summary.post.mjs.map
