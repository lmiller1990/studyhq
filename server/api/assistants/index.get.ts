import { openai } from "~/server/open_ai";

export default defineEventHandler(async (event) => {
  const assistants = await openai.beta.assistants.list();

  return assistants;
});
