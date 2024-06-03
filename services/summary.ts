import { openai } from "~/server/open_ai";

const summaryAssistantId = "asst_6tEZd66IwR0xV0gAeDeQXPlO";

const summaryPrompt = (msg: string) =>
  `
Return a brief, keyword based summary of the following message . Make it as concise as possible. It does not need to be a fully formed, grammatical sentence. Keep the summary length to 1-5 words. Prioritize terseness over descriptiveness.

The message to summarize is: ${msg}
`.trim();

export async function getSummary(msg: string) {
  const t = await openai.beta.threads.create({
    messages: [
      {
        content: summaryPrompt(msg),
        role: "user",
      },
    ],
  });

  const s = await openai.beta.threads.runs.createAndPoll(t.id, {
    assistant_id: summaryAssistantId,
  });

  // get the response
  const messages = await openai.beta.threads.messages.list(s.thread_id, {
    order: "desc",
  });

  // last one is summary
  const message = messages.data[0];

  if (!message || message.content[0].type !== "text") {
    throw Error("WTF");
  }

  console.log("Summary is ", message.content[0].text.value);

  return message.content[0].text.value;
}
