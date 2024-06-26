import { o as openai } from './open_ai.mjs';
import { a as assistants } from './shared.mjs';

const summaryPrompt = (msg) => `
Return a brief, keyword based summary of the following message . Make it as concise as possible. It does not need to be a fully formed, grammatical sentence. Keep the summary length to 1-5 words. Prioritize terseness over descriptiveness.

The message to summarize is: ${msg}
`.trim();
async function getSummary(msg) {
  const t = await openai.beta.threads.create({
    messages: [
      {
        content: summaryPrompt(msg),
        role: "user"
      }
    ]
  });
  const s = await openai.beta.threads.runs.createAndPoll(t.id, {
    assistant_id: assistants.summaryBot
  });
  const messages = await openai.beta.threads.messages.list(s.thread_id, {
    order: "desc"
  });
  const message = messages.data[0];
  console.log(
    "Conversation",
    // @ts-ignoree
    messages.data.map((x) => x.content[0].text.value).join("\n")
  );
  if (!message || message.content[0].type !== "text") {
    throw Error("WTF");
  }
  console.log(`Message for summary: ${message.content[0].text.value}`);
  console.log("Summary is ", message.content[0].text.value);
  return message.content[0].text.value;
}

export { getSummary as g };
//# sourceMappingURL=summary.mjs.map
