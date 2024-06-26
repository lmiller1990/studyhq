import { openai } from "~/server/open_ai";
import { assistants } from "~/server/shared";
import { getUser } from "~/server/token";
import { queryForThreadById } from "~/src/dynamo";
import { Writable } from "stream";

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
    } else {
      // console.log(`Used event: ${chunk.event}`);
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

  await openai.beta.threads.messages.create(thread.openai_id, {
    role: "user",
    content: body.message,
  });

  const res = event.node.res;
  const writer = new Writable({
    write(chunk, _encoding, cb) {
      res.write(chunk.toString());
      cb();
    },
  });

  await streamRun(thread.openai_id, assistants.undergraduateTutorAssistant, {
    onComplete: () => {
      res.end();
      return {};
    },
    onStart: () => {
      console.log("Starting...");
    },
    send: (msg) => {
      writer.write(msg);
    },
  });
});
