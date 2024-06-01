import OpenAI from "openai";
import { db } from "~/server/db";
import { openai } from "~/server/open_ai";

let myAssistant: OpenAI.Beta.Assistants.Assistant;

async function main() {
  if (myAssistant) {
    return myAssistant;
  }

  myAssistant = await openai.beta.assistants.create({
    instructions:
      "You are a tutor for undergraduate students at university. You recieve a list of learning material, such as lecture notes, practise exams, and general notes, and create questions to test the students' knowledge and understanding",
    name: "Univeristy Undergraduate Tutor",
    tools: [{ type: "file_search" }],
    tool_resources: {
      // file_search: {
      // vector_store_ids: ["vs_123"],
      // },
    },
    model: "gpt-4-turbo",
  });

  return myAssistant;
}

const assitantId = "asst_sxL8Gxy8meOwaf0vySOnegmu";
const threadId = "thread_BAUY2Zi8jKlYkgvsmgzalvL2";

export default defineEventHandler(async (event) => {
  // console.log(db);
  const users = await db.select("*").from("users");
  console.log(users);
  // const body = await readBody<{ message: string }>(event);
  // const run = await openai.beta.threads.runs.create(threadId, {
  //   assistant_id: assitantId,
  // });

  // console.log(JSON.stringify(run, null, 4));

  const messages = await openai.beta.threads.messages.list(threadId);
  for (const message of messages.data.reverse()) {
    if (message.content[0].type !== "text") {
      return;
    }
    console.log(`${message.role} > ${message.content[0].text.value}`);
  }
  // console.log(body.message);
  // const threadMessages = await openai.beta.threads.messages.create(threadId, {
  //   role: "user",
  //   content: body.message,
  // });
  // console.log(threadMessages);
  // const emptyThread = await openai.beta.threads.create();
  // return emptyThread;
  //
  // const assistant = await main();
  // console.log(assistant);
  //
  // assistant.
});
