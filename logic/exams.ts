/**
 * Exam has n questions, formatted like:
 *
 * Question 1 (X marks) ...
 *
 * Question 2 (X marks) ...
 *
 * Split into questions.
 */
export function splitExamIntoQuestions(exam: string) {
  // Regular expression to match each question block
  const pattern = /Question \d+.*?(?=(Question \d+|$))/gs;

  // Use match to find all relevant parts
  const split = exam.match(pattern);
  console.log("Splitting", split);

  if (!split) {
    throw new Error("No questions were found or unexpected format!");
  }

  return Array.from(split).map((x) => x.trim());
}
