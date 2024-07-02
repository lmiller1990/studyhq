import { getUser } from "~/server/token";
import { queryForExamsByUser, skToId } from "~/src/dynamo";

export default defineEventHandler(async (event) => {
  // HACK: https://github.com/nuxt/nuxt/issues/22488
  const user = await getUser(event);

  if (!user || user === "guest") {
    return [];
  }

  const exams = await queryForExamsByUser(user.email);

  return exams.map((exam) => {
    return {
      created_at: exam.created_at,
      id: skToId(exam.sk),
      summary: exam.summary,
    };
  });
});
