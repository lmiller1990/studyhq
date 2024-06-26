import { getUser } from "~/server/token";
import { getSummary } from "~/services/summary";
import { skToId, updateThreadSummary } from "~/src/dynamo";

export default defineEventHandler(async (event) => {
  const user = await getUser(event);
  const body = await readBody<{ message: string; threadId: string }>(event);
  const summary = await getSummary(body.message);
  await updateThreadSummary(user.email, body.threadId, summary);
  console.log(`Summary for ${body.message} is ${summary}`);
  return {};
});
