import { db } from "~/server/db";
import { openai } from "~/server/open_ai";

export default defineEventHandler(async (event) => {
  const threadsForUser = await db("threads")
    .where({ user_id: 1 })
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
