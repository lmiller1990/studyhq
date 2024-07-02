import crypto from "node:crypto";
import { createExam } from "~/server/exams";
import { questionSeparator } from "~/server/shared";
import { getUser } from "~/server/token";
import { getSummary } from "~/services/summary";
import { insertExam } from "~/src/dynamo";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ additionalContent: string }>(event);
  const user = await getUser(event);

  // await tryDeductFreeMessage(user);

  const [{ exam, questions }, examSummary] = await Promise.all([
    createExam(body.additionalContent),
    getSummary(body.additionalContent),
  ]);

  const uuid = crypto.randomUUID();

  await insertExam({
    email: user.email,
    uuid,
    openai_id: exam.thread_id,
    questions: questions.join(questionSeparator),
    summary: examSummary,
  });

  return { id: uuid };
});
