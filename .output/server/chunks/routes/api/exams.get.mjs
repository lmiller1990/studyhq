import { d as defineEventHandler } from '../../runtime.mjs';
import { g as getUser } from '../../_/token.mjs';
import { q as queryForExamsByUser, s as skToId } from '../../_/dynamo.mjs';
import 'node:http';
import 'node:https';
import 'node:crypto';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import '../../_/errors.mjs';
import '@aws-sdk/client-dynamodb';
import '@aws-sdk/util-dynamodb';

const exams_get = defineEventHandler(async (event) => {
  const user = await getUser(event);
  if (!user) {
    return [];
  }
  const exams = await queryForExamsByUser(user.email);
  console.log(exams);
  return exams.map((exam) => {
    return {
      created_at: exam.created_at,
      id: skToId(exam.sk),
      summary: exam.summary
    };
  });
});

export { exams_get as default };
//# sourceMappingURL=exams.get.mjs.map
