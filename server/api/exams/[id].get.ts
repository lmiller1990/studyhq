import { db } from "~/server/db";
import { questionSeparator } from "~/server/shared";

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
  const answers = (exam.answers ?? "").split(questionSeparator) as string[];
  return {
    questions,
    completed: Boolean(exam.completed),
    answers,
    feedback: exam.feedback as string,
  };
});
