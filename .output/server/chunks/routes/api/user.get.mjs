import { d as defineEventHandler } from '../../runtime.mjs';
import { g as getUser } from '../../_/token.mjs';
import 'node:http';
import 'node:https';
import 'node:crypto';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import '../../_/errors.mjs';
import '../../_/dynamo.mjs';
import '@aws-sdk/client-dynamodb';
import '@aws-sdk/util-dynamodb';

const user_get = defineEventHandler(async (event) => {
  try {
    return await getUser(event);
  } catch (e) {
  }
});

export { user_get as default };
//# sourceMappingURL=user.get.mjs.map
