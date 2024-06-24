import { openai } from "~/server/open_ai";
import { assistants } from "~/server/shared";
import { getUser } from "~/server/token";
import { queryForThreadById } from "~/src/dynamo";
import { Readable, Writable } from "stream";
import Stream from "stream/promises";

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

export default defineEventHandler(async (event) => {
  const user = await getUser(event);
  // await tryDeductFreeMessage(user);

  const body = await readBody<{ threadId: string; message: string }>(event);
  const thread = await queryForThreadById(user.email, body.threadId);

  if (!thread) {
    throw new Error(`No thread with id ${body.threadId} found!`);
  }

  console.log(`Creating message: ${body.message} in thread: ${body.threadId}`);
  const message = await openai.beta.threads.messages.create(thread.openai_id, {
    role: "user",
    content: body.message,
  });

  const res = event.node.res;
  const writer = new Writable({
    write(chunk, encoding, callback) {
      console.log("Write", chunk.toString());
      res.write(chunk.toString());
      // responseBody += chunk.toString();
      callback();
    },
  });

  // const stream = await Stream.pipeline(new Readable(), writer);

  const s = await streamRun(
    thread.openai_id,
    assistants.undergraduateTutorAssistant,
    {
      onComplete: () => {
        console.log("Done");
        res.end();
        return { result: "OK" };
      },
      onStart: () => console.log("Starting..."),
      send: (msg) => {
        console.log("Sending...", msg);
        writer.write(msg);
      },
    },
  );

  // return message;
});
