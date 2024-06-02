import { openai } from "~/server/open_ai";

const professorAssistantId = "asst_4wo91B5kt0nkr2mQG3XZoyZM";

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    exam: Array<{ question: string; answer: string }>;
  }>(event);
});
