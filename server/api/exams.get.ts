import { db } from "~/server/db";
import { maybeGetUser } from "~/server/token";

export default defineEventHandler(async (event) => {
  // HACK: https://github.com/nuxt/nuxt/issues/22488
  const user = await maybeGetUser(event);
  if (!user) {
    return [];
  }

  const exams = await db("exams")
    .where({ user_id: user.id })
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
