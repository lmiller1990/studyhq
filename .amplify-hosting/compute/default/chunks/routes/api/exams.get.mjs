import { d as defineEventHandler } from '../../../index.mjs';
import { d as db } from '../../_/db.mjs';
import { g as getUser } from '../../_/token.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'requrl';
import 'node:fs';
import 'node:url';
import 'knex';
import '../../_/errors.mjs';
import '../../_/nuxtAuthHandler.mjs';
import 'next-auth/core';
import 'next-auth/jwt';

const exams_get = defineEventHandler(async (event) => {
  const user = await getUser(event);
  if (!user) {
    return [];
  }
  const exams = await db("exams").where({ user_id: user.id }).orderBy("created", "desc").select("*");
  return exams.map((exam) => {
    return {
      created: exam.created,
      id: exam.id.toString(),
      summary: exam.summary.toString()
    };
  });
});

export { exams_get as default };
//# sourceMappingURL=exams.get.mjs.map
