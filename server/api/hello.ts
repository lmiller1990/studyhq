// import { cloudLog } from "~/src/aws";

export default defineEventHandler(async (event) => {
  // cloudLog("Hello!");
  return "OK!";
});
