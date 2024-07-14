import markdownit from "markdown-it";
import * as markdownItLatex from "markdown-it-latex";
import Shiki from "@shikijs/markdown-it";

const md = markdownit();

export async function createMarkdownIt() {
  try {
    md.use(markdownItLatex.default);
    md.use(
      await Shiki({
        fallbackLanguage: "sh",
        themes: {
          light: "github-dark",
          dark: "github-dark",
        },
      }),
    );
  } catch (e) {
    console.error("Error creating markdown renderer!", e);
  }

  return md;
}
