import { describe, expect, it } from "vitest";
import { splitExamIntoQuestions } from "../exams";

describe("splitExamIntoQuestions", () => {
  it("splits into separate questions", () => {
    const questions =
      splitExamIntoQuestions(`Question 1 (3 marks) Write a Python function.
      
      Question 2 (4 marks) Explain how a for loop works in Python.

      Question 3 (2 marks) What is the difference between a list and a tuple in Python?`);

    expect(questions).toMatchInlineSnapshot(`
      [
        "Question 1 (3 marks) Write a Python function.",
        "Question 2 (4 marks) Explain how a for loop works in Python.",
        "Question 3 (2 marks) What is the difference between a list and a tuple in Python?",
      ]
    `);
  });
});
