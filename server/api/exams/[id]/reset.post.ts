import { getUser } from "~/server/token";
import { resetExam } from "~/src/dynamo";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const user = await getUser(event);

  await resetExam({ email: user.email, uuid: id! });

  return;
});
