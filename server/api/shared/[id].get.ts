import { queryForSharedThreadById } from "~/src/dynamo";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  try {
    const thread = await queryForSharedThreadById(id!);
    return {
      content: thread.content,
      summary: thread.summary,
    };
  } catch {
    return;
  }
});
