import { db } from "~/server/db";
import { openai } from "~/server/open_ai";
import { getUser } from "~/server/token";

export default defineEventHandler(async (event) => {
  const user = await getUser(event);

  if (!user) {
    return [];
  }

  const threadsForUser = await db("threads")
    .where({ user_id: user.id })
    .whereNotNull("summary");

  const all = await Promise.all(
    threadsForUser.map(async (x) => {
      const t = await openai.beta.threads.retrieve(x.openai_id);
      return {
        ...t,
        openai_id: t.id,
        id: (x.id as number).toString(),
        summary: (x.summary?.toString() ?? "") as string,
      };
    }),
  );

  all.sort((x, y) => (x.created_at - y.created_at ? -1 : 1));

  return all;
});
