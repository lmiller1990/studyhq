import { db } from "~/server/db";
import { openai } from "~/server/open_ai";

export const questionSeparator = "__QUESTION__";

const professorAssistantId = "asst_4wo91B5kt0nkr2mQG3XZoyZM";

const assistantPrompt = `
You are a professor tasked with creating practice exams. 

You will receive instructions to generate an exam. 

Your questions should be concise, clear and relevant to the topic. 

Pay special attention to the additional content - that's what the student is looking to learn about. 

You can also include questions related to the topic and additional content that are not explicitly included if you think those will help the student develop a better understanding of the topic.`;

const examPrompt = (topic: string, additionalContent: string) => `
Hi. I want you to write a practice exam on ${topic}. Make 10 questions. The format should be:

<question> (<n marks>)

For example:

Question 1 (2 marks) Describe a cell. Name two interesting facts.

Do not include anything in your response other than the questions in the template above. No summary, no additional notes before or after the exam.

Here's some additional content you should consider when making the questions:

${additionalContent}
`;

export default defineEventHandler(async (event) => {
  const body = await readBody<{ topic: string; additionalContent: string }>(
    event,
  );

  console.log("Creating thread for exam...");
  const emptyThread = await openai.beta.threads.create({
    messages: [
      {
        content: examPrompt(body.topic, body.additionalContent),
        role: "user",
      },
    ],
  });

  console.log("Created thread", emptyThread);
  console.log("Creating exam...");
  const exam = await openai.beta.threads.runs.createAndPoll(emptyThread.id, {
    assistant_id: professorAssistantId,
  });

  console.log(exam);

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

  await db("exams").insert({
    openai_id: exam.id,
    questions: questions.join(questionSeparator),
    user_id: 1,
  });
  console.log(questions);
  return exam;
});
