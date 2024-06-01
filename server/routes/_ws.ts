import { db } from "~/server/db";
import { openai } from "~/server/open_ai";

const assitantId = "asst_sxL8Gxy8meOwaf0vySOnegmu";

interface StreamCallbackOptions {
  send: (chunk: string) => void;
  onComplete: () => void;
  onStart: () => void;
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
  },

  async message(peer, message) {
    const parsed = JSON.parse(message.text());

    const dbthread = await db("threads").where({ id: parsed.threadId }).first();
    if (!dbthread) {
      throw new Error(`No thread with id ${parsed.threadId} found!`);
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

      onComplete: () => {
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
