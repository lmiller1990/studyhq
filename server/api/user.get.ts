import { getUser } from "~/server/token";

export default defineEventHandler(async (event) => {
  try {
    return await getUser(event);
  } catch (e) {
    // anon?
  }
});
