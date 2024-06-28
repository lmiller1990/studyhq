import { getUser } from "~/server/token";
import { queryAllUsers } from "~/src/dynamo";

export default defineEventHandler(async (event) => {
  // error if not authenticated
  await getUser(event);

  return await queryAllUsers();
});
