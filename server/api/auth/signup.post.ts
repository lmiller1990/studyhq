import { db } from "~/server/db";

export default defineEventHandler(async (event) => {
  const { email } = await readBody<{ email: string }>(event);

  const exists = await db("users").where({ email }).first();

  if (exists) {
    return exists;
  }

  return await db("users").insert({ email }).returning("*");
});
