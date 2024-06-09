import { d as defineEventHandler, g as getRouterParam } from '../../../../../index.mjs';
import { d as db } from '../../../../_/db.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'requrl';
import 'node:fs';
import 'node:url';
import 'knex';

const reset_post = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  console.log({ id });
  await db("exams").where({ id }).update({
    feedback: null,
    completed: false,
    answers: null
  });
  return;
});

export { reset_post as default };
//# sourceMappingURL=reset.post.mjs.map
