import { db } from "~/server/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  console.log({ id });

  await db("exams").where({ id }).update({
    feedback: null,
    completed: false,
    answers: null,
  });

  return;
});
