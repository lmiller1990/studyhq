import { openai } from "~/server/open_ai";
import { getUser } from "~/server/token";
import { queryForThreadById } from "~/src/dynamo";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const user = await getUser(event);
  const thread = await queryForThreadById(user.email, id!);

  if (!thread) {
    throw new Error(`No thread with id ${id} found!`);
  }

  const threadMessages = await openai.beta.threads.messages.list(
    thread.openai_id,
    {
      limit: 5,
      order: "desc",
    },
  );

  return threadMessages.data.reverse();
});
