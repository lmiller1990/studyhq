import { db } from "~/server/db";

export default defineEventHandler(async (event) => {
  // HACK: https://github.com/nuxt/nuxt/issues/22488
  const exams = await db("exams")
    .where({ user_id: 1 })
    .orderBy("created", "desc")
    .select("*");

  return exams.map((exam) => {
    return {
      created: exam.created as string,
      id: exam.id.toString() as string,
      summary: exam.summary.toString() as string,
    };
  });
});
