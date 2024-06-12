import { answerSeparator, questionSeparator } from "~/server/shared";
import { getUser } from "~/server/token";
import { queryForExamById } from "~/src/dynamo";

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
  const user = await getUser(event);
  const exam = await queryForExamById(user.email, id!);
  const questions = exam.questions.split(questionSeparator) as string[];
  const answers = (exam.answers ?? "").split(answerSeparator) as string[];
  return {
    questions,
    completed: Boolean(exam.completed),
    answers,
    feedback: exam.feedback as string,
  };
});
