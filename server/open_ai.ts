import OpenAI from "openai";

export const openai = new OpenAI();

// let myAssistant: OpenAI.Beta.Assistants.Assistant;

// async function getOpenAIClient() {
//   if (myAssistant) {
//     return myAssistant;
//   }

//   myAssistant = await openai.beta.assistants.create({
//     instructions:
//       "You are a tutor for undergraduate students at university. You recieve a list of learning material, such as lecture notes, practise exams, and general notes, and create questions to test the students' knowledge and understanding",
//     name: "Univeristy Undergraduate Tutor",
//     tools: [{ type: "file_search" }],
//     tool_resources: {
//       // file_search: {
//       // vector_store_ids: ["vs_123"],
//       // },
//     },
//     model: "gpt-4-turbo",
//   });

//   return myAssistant;
// }
