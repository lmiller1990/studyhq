import { db } from "~/server/db";
import { openai } from "~/server/open_ai";

const assitantId = "asst_sxL8Gxy8meOwaf0vySOnegmu";

async function streamRun(
  threadId: string,
  assistantId: string,
  send: (chunk: string) => void,
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
    streamRun(dbthread.openai_id, assitantId, (textChunk) =>
      peer.send(
        JSON.stringify({
          type: "text-chunk",
          text: textChunk,
        }),
      ),
    );
  },

  close(peer, event) {
    console.log("[ws] close", peer, event);
  },

  error(peer, error) {
    console.log("[ws] error", peer, error);
  },
});
