import { d as defineEventHandler, g as getRouterParam } from '../../../runtime.mjs';
import { q as questionSeparator, b as answerSeparator } from '../../../_/shared.mjs';
import { g as getUser } from '../../../_/token.mjs';
import { a as queryForExamById } from '../../../_/dynamo.mjs';
import 'node:http';
import 'node:https';
import 'node:crypto';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import '../../../_/errors.mjs';
import '@aws-sdk/client-dynamodb';
import '@aws-sdk/util-dynamodb';

const _id__get = defineEventHandler(async (event) => {
  var _a, _b;
  const id = (_a = getRouterParam(event, "id")) == null ? void 0 : _a.split(":")[1];
  const user = await getUser(event);
  const exam = await queryForExamById(user.email, id);
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
