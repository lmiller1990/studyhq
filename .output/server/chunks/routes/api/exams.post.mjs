import { d as defineEventHandler, r as readBody } from '../../runtime.mjs';
import nodeCrypto from 'node:crypto';
import { o as openai } from '../../_/open_ai.mjs';
import { q as questionSeparator, a as assistants } from '../../_/shared.mjs';
import { g as getUser } from '../../_/token.mjs';
import { g as getSummary } from '../../_/summary.mjs';
import { i as insertExam } from '../../_/dynamo.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'openai';
import '../../_/errors.mjs';
import '@aws-sdk/client-dynamodb';
import '@aws-sdk/util-dynamodb';

function splitExamIntoQuestions(exam) {
  const pattern = /Question \d+.*?(?=(Question \d+|$))/gs;
  const split = exam.match(pattern);
  if (!(split == null ? void 0 : split.length)) {
    throw new Error("No questions were found or unexpected format!");
  }
  return Array.from(split).map((x) => x.trim());
}

const examPrompt = (additionalContent, numQuestions) => `
Hi. I want you to write a practice exam. Make ${numQuestions} questions. The format should be:

<question> (<n marks>)

Here is an example using the format:

Question 1 (2 marks) Describe a cell. Name two interesting facts.

Do not include anything in your response other than questions written in the way described by the template above. No summary, no additional notes before or after the exam.

Here's the topics and content you should consider when making the questions:

${additionalContent}
`;
async function createExam(additionalContent) {
  const numQuestions = 5;
  const content = examPrompt(additionalContent, numQuestions);
  const emptyThread = await openai.beta.threads.create({
    messages: [
      {
        content,
        role: "user"
      }
    ]
  });
  const exam = await openai.beta.threads.runs.createAndPoll(emptyThread.id, {
    assistant_id: assistants.practiceExamBot
  });
  const messages = await openai.beta.threads.messages.list(exam.thread_id, {
    order: "desc"
  });
  const examMessage = messages.data[0];
  if (!examMessage || examMessage.content[0].type !== "text") {
    throw Error("No exam - something is wrong");
  }
  const questions = splitExamIntoQuestions(examMessage.content[0].text.value);
  if (questions.length !== numQuestions) {
    console.log(examMessage.content[0].text.value);
    throw new Error(`Expected ${numQuestions}, got ${questions.length}`);
  }
  return { exam, questions };
}
const exams_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = await getUser(event);
  const [{ exam, questions }, examSummary] = await Promise.all([
    createExam(body.additionalContent),
    getSummary(body.additionalContent)
  ]);
  const uuid = nodeCrypto.randomUUID();
  await insertExam({
    email: user.email,
    uuid,
    openai_id: exam.thread_id,
    questions: questions.join(questionSeparator),
    summary: examSummary
  });
  return { id: uuid };
});

export { exams_post as default };
//# sourceMappingURL=exams.post.mjs.map
