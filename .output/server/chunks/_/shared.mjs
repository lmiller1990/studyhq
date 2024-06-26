const questionSeparator = "__QUESTION__";
const answerSeparator = "__ANSWER__";
const assistants = {
  /**
   * This is the assistant for general chat about studying.
   * "University Undergraduate Tutor"
   * @see https://platform.openai.com/playground/assistants?assistant=asst_sxL8Gxy8meOwaf0vySOnegmu
   */
  undergraduateTutorAssistant: "asst_sxL8Gxy8meOwaf0vySOnegmu",
  /**
   * Creates practice exams with a specific format.
   * @see https://platform.openai.com/playground/assistants?assistant=asst_4wo91B5kt0nkr2mQG3XZoyZM
   */
  practiceExamBot: "asst_4wo91B5kt0nkr2mQG3XZoyZM",
  /**
   * Titlebot
   *
   * Summarized threads
   * @see https://platform.openai.com/playground/assistants?assistant=asst_6tEZd66IwR0xV0gAeDeQXPlO
   */
  summaryBot: "asst_6tEZd66IwR0xV0gAeDeQXPlO",
  /**
   * Titlebot
   *
   * Summarized threads
   * @see https://platform.openai.com/playground/assistants?assistant=asst_ws4lF7WUDIW7GWQkWlyQ7IM0
   */
  examGradingBot: "asst_ws4lF7WUDIW7GWQkWlyQ7IM0"
};

export { assistants as a, answerSeparator as b, questionSeparator as q };
//# sourceMappingURL=shared.mjs.map
