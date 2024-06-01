import { db } from "~/server/db";
import { openai } from "~/server/open_ai";

const assitantId = "asst_sxL8Gxy8meOwaf0vySOnegmu";

async function streamRun(
  threadId: string,
  assistantId: string,
  send: (chunk: string) => void
) {
  console.log("Streaming");
  const stream = openai.beta.threads.runs.stream(threadId, {
    assistant_id: assistantId,
  });

  for await (const chunk of stream) {
    // console.log("Event:", chunk.event);
    if (chunk.event === "thread.message.delta") {
      if (chunk.data.delta.content?.[0]?.type === "text") {
        send(chunk.data.delta.content[0].text?.value!);
        // process.stdout.write(chunk.data.delta.content[0].text?.value);
      }
    }
  }
}

// .on("textCreated", (text) => process.stdout.write("\nassistant > "))
// .on("textDelta", (textDelta, snapshot) =>
//   process.stdout.write(textDelta.value)
// )
// .on("toolCallCreated", (toolCall) =>
//   process.stdout.write(`\nassistant > ${toolCall.type}\n\n`)
// )
// .on("toolCallDelta", (toolCallDelta, snapshot) => {
//   if (toolCallDelta.type === "code_interpreter") {
//     if (toolCallDelta.code_interpreter.input) {
//       process.stdout.write(toolCallDelta.code_interpreter.input);
//     }
//     if (toolCallDelta.code_interpreter.outputs) {
//       process.stdout.write("\noutput >\n");
//       toolCallDelta.code_interpreter.outputs.forEach((output) => {
//         if (output.type === "logs") {
//           process.stdout.write(`\n${output.logs}\n`);
//         }
//       });
//     }
//   }
// });

export default defineWebSocketHandler({
  open(peer) {
    console.log("[ws] open", peer);
  },

  async message(peer, message) {
    console.log("[ws] message", peer, message);
    const parsed = JSON.parse(message.text());
    console.log(parsed);

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
        })
      )
    );
    // if (message.text().includes("ping")) {
    //   peer.send("pong");
    // }

    // if (message.text().includes("dorun")) {
    //   streamRun()
    // }
  },

  close(peer, event) {
    console.log("[ws] close", peer, event);
  },

  error(peer, error) {
    console.log("[ws] error", peer, error);
  },
});
