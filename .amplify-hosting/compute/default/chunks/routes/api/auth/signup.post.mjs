import { d as defineEventHandler, r as readBody } from '../../../../index.mjs';
import { d as db } from '../../../_/db.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'requrl';
import 'node:fs';
import 'node:url';
import 'knex';

const signup_post = defineEventHandler(async (event) => {
  const { email } = await readBody(event);
  const exists = await db("users").where({ email }).first();
  if (exists) {
    return exists;
  }
  return await db("users").insert({ email }).returning("*");
});

export { signup_post as default };
//# sourceMappingURL=signup.post.mjs.map
