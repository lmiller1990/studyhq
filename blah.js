const text = `
Question 1 (2 marks)

blah

Question 2 (marks)

asdf

Question 3

heheheh
`;

// Regular expression to match each question block
const pattern = /Question \d+.*?(?=(Question \d+|$))/gs;

// Use match to find all relevant parts
const chunks = text.match(pattern);

// Check the output
if (chunks) {
  chunks.forEach((chunk, index) => {
    // console.log(`----\nChunk ${index + 1}:\n${chunk}`);
    console.log(chunk);
    console.log("=============");
  });
} else {
  console.log("No matches found.");
}
