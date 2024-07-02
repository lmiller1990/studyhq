import { createExam } from "~/server/exams";
import crypto from "node:crypto";
import { questionSeparator } from "~/server/shared";
import { insertExam } from "~/src/dynamo";

export default defineEventHandler(async (event) => {
  const { subject } = await readBody<{ subject: string }>(event);

  await setUserSession(event, {
    user: {
      guest: true,
    },
  });

  // await tryDeductFreeMessage(user);

  const { exam, questions } = await createExam(subject, 2);
  console.log(exam, questions);

  const uuid = crypto.randomUUID();

  await insertExam({
    email: "guest",
    uuid,
    openai_id: exam.thread_id,
    questions: questions.join(questionSeparator),
    summary: `Example: ${subject}`,
  });

  return { id: uuid };
});
