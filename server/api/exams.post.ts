import { splitExamIntoQuestions } from "~/logic/exams";
import { db } from "~/server/db";
import { openai } from "~/server/open_ai";
import { assistants, questionSeparator } from "~/server/shared";
import { maybeGetUser } from "~/server/token";
import { getSummary } from "~/services/summary";

const examPrompt = (additionalContent: string, numQuestions: number) => `
Hi. I want you to write a practice exam. Make ${numQuestions} questions. The format should be:

<question> (<n marks>)

Here is an example using the format:

Question 1 (2 marks) Describe a cell. Name two interesting facts.

Do not include anything in your response other than questions written in the way described by the template above. No summary, no additional notes before or after the exam.

Here's the topics and content you should consider when making the questions:

${additionalContent}
`;

async function createExam(additionalContent: string) {
  const numQuestions = 5;
  const content = examPrompt(additionalContent, numQuestions);

  const emptyThread = await openai.beta.threads.create({
    messages: [
      {
        content,
        role: "user",
      },
    ],
  });

  const exam = await openai.beta.threads.runs.createAndPoll(emptyThread.id, {
    assistant_id: assistants.practiceExamBot,
  });

  const messages = await openai.beta.threads.messages.list(exam.thread_id, {
    order: "desc",
  });

  const examMessage = messages.data[0];

  if (!examMessage || examMessage.content[0].type !== "text") {
    throw Error("No exam - something is wrong");
  }

  const questions = splitExamIntoQuestions(examMessage.content[0].text.value);

  if (questions.length !== numQuestions) {
    console.log(examMessage.content[0].text.value);
    throw new Error(`Expected ${numQuestions}, got ${questions.length}`);
  }

  return { exam, questions };
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ additionalContent: string }>(event);
  const user = await maybeGetUser(event);

  if (!user) {
    throw new Error("Need to be authenticated");
  }

  const [{ exam, questions }, examSummary] = await Promise.all([
    createExam(body.additionalContent),
    getSummary(body.additionalContent),
  ]);

  const dbExam = await db("exams")
    .insert({
      openai_id: exam.thread_id,
      questions: questions.join(questionSeparator),
      summary: examSummary,
      user_id: user.id,
    })
    .returning("id");

  return { id: dbExam[0].id as string };
});
