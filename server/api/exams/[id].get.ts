import { questionSeparator } from "~/server/api/exams.post";
import { db } from "~/server/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const exam = await db("exams").where({ id }).first();
  const questions = exam.questions.split(questionSeparator);
  return questions;
});
