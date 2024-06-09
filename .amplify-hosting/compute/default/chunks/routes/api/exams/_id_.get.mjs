import { d as defineEventHandler, g as getRouterParam } from '../../../../index.mjs';
import { d as db } from '../../../_/db.mjs';
import { q as questionSeparator, b as answerSeparator } from '../../../_/shared.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'requrl';
import 'node:fs';
import 'node:url';
import 'knex';

const _id__get = defineEventHandler(async (event) => {
  var _a, _b;
  const id = (_a = getRouterParam(event, "id")) == null ? void 0 : _a.split(":")[1];
  const exam = await db("exams").where({ id }).first();
  const questions = exam.questions.split(questionSeparator);
  const answers = ((_b = exam.answers) != null ? _b : "").split(answerSeparator);
  return {
    questions,
    completed: Boolean(exam.completed),
    answers,
    feedback: exam.feedback
  };
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
