import { d as defineEventHandler, r as readBody } from '../../runtime.mjs';
import { o as openai } from '../../_/open_ai.mjs';
import { a as assistants } from '../../_/shared.mjs';
import { g as getUser } from '../../_/token.mjs';
import { b as queryForThreadById } from '../../_/dynamo.mjs';
import { Writable } from 'stream';
import 'node:http';
import 'node:https';
import 'node:crypto';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'openai';
import '../../_/errors.mjs';
import '@aws-sdk/client-dynamodb';
import '@aws-sdk/util-dynamodb';

async function streamRun(threadId, assistantId, { send: send2, onComplete, onStart }) {
  var _a, _b, _c;
  const stream = openai.beta.threads.runs.stream(threadId, {
    assistant_id: assistantId
  });
  for await (const chunk of stream) {
    if (chunk.event === "thread.message.delta") {
      if (((_b = (_a = chunk.data.delta.content) == null ? void 0 : _a[0]) == null ? void 0 : _b.type) === "text") {
        send2((_c = chunk.data.delta.content[0].text) == null ? void 0 : _c.value);
      }
    } else if (chunk.event === "thread.run.completed") {
      onComplete();
    } else if (chunk.event === "thread.run.created") {
      onStart();
    } else ;
  }
}
const message_post = defineEventHandler(async (event) => {
  const user = await getUser(event);
  const body = await readBody(event);
  const thread = await queryForThreadById(user.email, body.threadId);
  if (!thread) {
    throw new Error(`No thread with id ${body.threadId} found!`);
  }
  console.log(`Creating message: ${body.message} in thread: ${body.threadId}`);
  await openai.beta.threads.messages.create(thread.openai_id, {
    role: "user",
    content: body.message
  });
  const res = event.node.res;
  const writer = new Writable({
    write(chunk, _encoding, cb) {
      res.write(chunk.toString());
      cb();
    }
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
    }
  });
});

export { message_post as default };
//# sourceMappingURL=message.post.mjs.map
