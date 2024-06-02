import { db } from "~/server/db";

export const questionSeparator = "__QUESTION__";

interface Exam {
  openai_id: string;
  questions: string;
  user_id: number;
  completed?: boolean;
  feedback?: string;
  created: string;
}

export default defineEventHandler(async (event) => {
  // HACK: https://github.com/nuxt/nuxt/issues/22488
  const id = getRouterParam(event, "id")?.split(":")[1];
  const exam = await db("exams").where({ id }).first();
  const questions = exam.questions.split(questionSeparator) as string[];
  return {
    questions,
    completed: Boolean(exam.completed),
    feedback: exam.feedback as string,
  };
});
