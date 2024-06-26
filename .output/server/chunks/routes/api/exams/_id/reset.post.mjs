import { d as defineEventHandler, g as getRouterParam } from '../../../../runtime.mjs';
import { g as getUser } from '../../../../_/token.mjs';
import { r as resetExam } from '../../../../_/dynamo.mjs';
import 'node:http';
import 'node:https';
import 'node:crypto';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import '../../../../_/errors.mjs';
import '@aws-sdk/client-dynamodb';
import '@aws-sdk/util-dynamodb';

const reset_post = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const user = await getUser(event);
  await resetExam({ email: user.email, uuid: id });
  return;
});

export { reset_post as default };
//# sourceMappingURL=reset.post.mjs.map
