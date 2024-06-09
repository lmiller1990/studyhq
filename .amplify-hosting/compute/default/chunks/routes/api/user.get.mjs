import { d as defineEventHandler } from '../../../index.mjs';
import { g as getUser } from '../../_/token.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'requrl';
import 'node:fs';
import 'node:url';
import '../../_/db.mjs';
import 'knex';
import '../../_/errors.mjs';
import '../../_/nuxtAuthHandler.mjs';
import 'next-auth/core';
import 'next-auth/jwt';

const user_get = defineEventHandler(async (event) => {
  try {
    return await getUser(event);
  } catch (e) {
  }
});

export { user_get as default };
//# sourceMappingURL=user.get.mjs.map
