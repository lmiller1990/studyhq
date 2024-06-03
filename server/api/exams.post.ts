import { db } from "~/server/db";
import { openai } from "~/server/open_ai";
import { questionSeparator } from "~/server/shared";
import { getSummary } from "~/services/summary";

export const professorAssistantId = "asst_4wo91B5kt0nkr2mQG3XZoyZM";

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
  const content = examPrompt(additionalContent, 5);

  console.log("Creating thread for exam...");
  const emptyThread = await openai.beta.threads.create({
    messages: [
      {
        content,
        role: "user",
      },
    ],
  });

  console.log("Created thread", emptyThread);
  console.log("Creating exam...");
  const exam = await openai.beta.threads.runs.createAndPoll(emptyThread.id, {
    assistant_id: professorAssistantId,
  });

  const messages = await openai.beta.threads.messages.list(exam.thread_id, {
    order: "desc",
  });

  const examMessage = messages.data[0];

  if (!examMessage || examMessage.content[0].type !== "text") {
    throw Error("No exam - something is wrong");
  }

  const questions = examMessage.content[0].text.value
    .split("\n")
    .reduce<
      string[]
    >((acc, curr) => (curr.length > 0 ? acc.concat(curr) : acc), []);

  return { exam, questions };
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ additionalContent: string }>(event);

  const [{ exam, questions }, examSummary] = await Promise.all([
    createExam(body.additionalContent),
    getSummary(body.additionalContent),
  ]);

  const dbExam = await db("exams")
    .insert({
      openai_id: exam.thread_id,
      questions: questions.join(questionSeparator),
      summary: examSummary,
      user_id: 1,
    })
    .returning("id");

  return { id: dbExam[0].id as string };
});
