import { openai } from "~/server/open_ai";
import { getUser } from "~/server/token";
import { queryForThreadsByUser } from "~/src/dynamo";

export default defineEventHandler(async (event) => {
  const user = await getUser(event);

  if (!user || user === "guest") {
    return [];
  }

  const threadsForUser = await queryForThreadsByUser(user.email);

  const all = await Promise.all(
    threadsForUser.map(async (x) => {
      const id = x.sk.split("#")[1]!;
      const t = await openai.beta.threads.retrieve(x.openai_id);
      return {
        ...t,
        openai_id: t.id,
        id,
        summary: x.summary as string,
      };
    }),
  );

  all.sort((x, y) => (x.created_at < y.created_at ? 1 : -1));

  return all;
});
