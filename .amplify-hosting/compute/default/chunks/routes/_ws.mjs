import { o as defineWebSocketHandler } from '../../index.mjs';
import { d as db } from '../_/db.mjs';
import { o as openai } from '../_/open_ai.mjs';
import { a as assistants } from '../_/shared.mjs';
import { g as getSummary } from '../_/summary.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'requrl';
import 'node:fs';
import 'node:url';
import 'knex';
import 'openai';

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
    } else {
      console.log(`Used event: ${chunk.event}`);
    }
  }
}
const _ws = defineWebSocketHandler({
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
    console.log("Parsed", parsed);
    if (!dbthread.summary && parsed.firstMessage) {
      console.log(`Summarizing using first message: ${parsed.firstMessage}`);
      getSummary(parsed.firstMessage).then((summary) => {
        db("threads").where({ id: dbthread.id }).update({
          summary
        }).then(() => {
          console.log("Done summarizing.");
          console.log("sending...");
          peer.send(
            JSON.stringify({
              type: "summary.completed"
            })
          );
        });
      });
    }
    streamRun(dbthread.openai_id, assistants.undergraduateTutorAssistant, {
      send: (textChunk) => {
        peer.send(
          JSON.stringify({
            type: "thread.message.delta",
            text: textChunk
          })
        );
      },
      onComplete: async () => {
        peer.send(
          JSON.stringify({
            type: "thread.run.completed"
          })
        );
      },
      onStart: () => {
        peer.send(
          JSON.stringify({
            type: "thread.run.created"
          })
        );
      }
    });
  },
  close(peer, event) {
    console.log("[ws] close", peer, event);
  },
  error(peer, error) {
    console.log("[ws] error", peer, error);
  }
});

export { _ws as default };
//# sourceMappingURL=_ws.mjs.map
