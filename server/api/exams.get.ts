import { db } from "~/server/db";
import { getUser } from "~/server/token";
import { queryForExamsByUser } from "~/src/dynamo";

export default defineEventHandler(async (event) => {
  // HACK: https://github.com/nuxt/nuxt/issues/22488
  const user = await getUser(event);
  if (!user) {
    return [];
  }

  const exams = await queryForExamsByUser(user.email);

  return exams.map((exam) => {
    return {
      created_at: exam.created_at,
      id: exam.sk,
      summary: exam.summary,
    };
  });
});
