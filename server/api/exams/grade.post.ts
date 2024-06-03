import { openai } from "~/server/open_ai";

import { professorAssistantId } from "../exams.post";
import { db } from "~/server/db";
import { answerSeparator } from "~/server/shared";

const assistantPrompt = (qa: string) => `
You are a professor grading practice exams. The format for the exam is:

<question X> (<n marks>) <question>

<answer>

For example:

Question 1 (2 marks) Describe a cell. Name two interesting facts.

1. Cells are the fundamental units of life.
2. Cells have specialized organelles for various functions, such as energy
production and protein synthesis.

You should grade the exam. Consider the amount of marks designated. 
Provide feedback as concisely as possible, correcting errors or clarifying any issues.
You do want to give a student marks where possible - be reasonable, so describe where they earned marks,
but also outline why they lost marks, if they did, and why and how they could improve.

When responding, format should be as follows:

<question X>  (marks / total) 

<feedback, if relevant>

Do not include anything other than the above template in your response. Be concise.

Here are the questions and answers:

${qa}
`;

export default defineEventHandler(async (event) => {
  const { id, questions } = await readBody<{
    id: string;
    questions: Array<{ question: string; answer: string }>;
  }>(event);

  console.log({ id, questions });

  const content = questions
    .map(({ question, answer }) => `${question}\n\nAnswer: ${answer}`)
    .join("\n\n");
  const dbexam = await db("exams").where({ id }).first();

  await openai.beta.threads.runs.createAndPoll(dbexam.openai_id, {
    assistant_id: professorAssistantId,
    additional_messages: [
      {
        role: "assistant",
        content: assistantPrompt(content),
      },
    ],
  });

  // get the response
  const messages = await openai.beta.threads.messages.list(dbexam.openai_id, {
    order: "desc",
  });

  const message = messages.data[0];

  if (!message || message.content[0].type !== "text") {
    throw Error("WTF");
  }

  await db("exams").update({
    completed: 1,
    feedback: message.content[0].text.value,
    answers: questions.map(({ answer }) => answer).join(answerSeparator),
  });

  console.log(message.content[0].text.value);
  return message.content[0].text.value;
});
