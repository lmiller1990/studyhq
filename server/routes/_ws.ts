import { db } from "~/server/db";
import { openai } from "~/server/open_ai";

const assitantId = "asst_sxL8Gxy8meOwaf0vySOnegmu";

interface StreamCallbackOptions {
  send: (chunk: string) => void;
  onComplete: () => void;
  onStart: () => void;
}

const summaryAssistantId = "asst_6tEZd66IwR0xV0gAeDeQXPlO";

const summaryPrompt = (msg: string) =>
  `
Return a brief, keyword based summary of the following message . Make it as concise as possible. It does not need to be a fully formed, grammatical sentence. Keep the summary length to 1-5 words. Prioritize terseness over descriptiveness.

The message to summarize is: ${msg}
`.trim();

async function getSummary(msg: string) {
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

async function streamRun(
  threadId: string,
  assistantId: string,
  { send, onComplete, onStart }: StreamCallbackOptions,
) {
  const stream = openai.beta.threads.runs.stream(threadId, {
    assistant_id: assistantId,
  });

  for await (const chunk of stream) {
    if (chunk.event === "thread.message.delta") {
      if (chunk.data.delta.content?.[0]?.type === "text") {
        send(chunk.data.delta.content[0].text?.value!);
        // process.stdout.write(chunk.data.delta.content[0].text?.value);
      }
    } else if (chunk.event === "thread.run.completed") {
      onComplete();
    } else if (chunk.event === "thread.run.created") {
      onStart();
      //
    } else {
      console.log(`Used event: ${chunk.event}`);
    }
  }
}

export default defineWebSocketHandler({
  open(peer) {
    console.log("[ws] open", peer);

    peer.send(JSON.stringify({ text: "Pong" }));
  },

  async message(peer, message) {
    const parsed = JSON.parse(message.text());

    const dbthread = await db("threads").where({ id: parsed.threadId }).first();
    if (!dbthread) {
      throw new Error(`No thread with id ${parsed.threadId} found!`);
    }

    if (!dbthread.summary && parsed.firstMessage) {
      console.log(`Summarizing using first message: ${parsed.firstMessage}`);
      getSummary(parsed.firstMessage).then((summary) => {
        db("threads")
          .where({ id: dbthread.id })
          .update({
            summary,
          })
          .then(() => {
            console.log("Done summarizing.");
            console.log("sending...");
            peer.send(
              JSON.stringify({
                type: "summary.completed",
              }),
            );
          });
      });
    }

    // const openaiThread = await openai.beta.threads.retrieve(dbthread.openai_id);
    streamRun(dbthread.openai_id, assitantId, {
      send: (textChunk) => {
        peer.send(
          JSON.stringify({
            type: "thread.message.delta",
            text: textChunk,
          }),
        );
      },

      onComplete: async () => {
        peer.send(
          JSON.stringify({
            type: "thread.run.completed",
          }),
        );
      },

      onStart: () => {
        peer.send(
          JSON.stringify({
            type: "thread.run.created",
          }),
        );
      },
    });
  },

  close(peer, event) {
    console.log("[ws] close", peer, event);
  },

  error(peer, error) {
    console.log("[ws] error", peer, error);
  },
});
