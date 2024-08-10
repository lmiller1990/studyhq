import { Message } from "openai/resources/beta/threads/messages.mjs";
import { renderMarkdown } from "~/composables/useMarkdown";
import { openai } from "~/server/open_ai";
import { getUser } from "~/server/token";
import { insertPublicThread, queryForThreadById } from "~/src/dynamo";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")!;
  const user = await getUser(event);
  // @ts-ignore - guest cannot get here
  const thread = await queryForThreadById(user.email, id!);

  const allMsgs: Message[] = [];

  for await (const message of openai.beta.threads.messages.list(
    thread.openai_id,
    {
      limit: 20,
      order: "asc",
    },
  )) {
    allMsgs.push(message);
  }
  const lis: string[] = [];

  const render = await renderMarkdown();

  for (const message of allMsgs) {
    if (message.content[0].type !== "text") {
      continue;
    }

    const html = render(message.content[0].text.value);

    const klass =
      message.role === "user"
        ? "bg-gray-200 dark:bg-gray-700 max-w-[50vw]"
        : "dark:bg-gray-800";

    lis.push(`
      <li class="flex w-full my-4 ${message.role === "user" ? "justify-end" : ""}">
        <div class="p-1 rounded px-2 ${klass}">
          <span class="msg">
            ${html}
           </span> 
        </div>
      </li>`);
  }

  const html = `<ul>${lis.join("\n")}</ul>`;
  console.log(html);

  await insertPublicThread(id, thread.openai_id, html, thread.summary);

  return {};
});
