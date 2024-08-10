import markdownit from "markdown-it";
import markdownItLatex from "markdown-it-latex";
import Shiki from "@shikijs/markdown-it";

async function createMarkdownRenderer() {
  const md = markdownit();

  async function tryApplyPlugin(name: string, p: () => any) {
    try {
      console.log(`Applying plugin ${name}`);
      md.use(await p());
    } catch (e) {
      console.error(`Error creating markdown renderer for plugin ${name}`, e);
    }
  }

  tryApplyPlugin("latex", () => markdownItLatex);

  await tryApplyPlugin(
    "shiki",
    async () =>
      await Shiki({
        fallbackLanguage: "sh",
        themes: {
          light: "github-dark",
          dark: "github-dark",
        },
      }),
  );

  return md;
}

export async function renderMarkdown() {
  const md = await createMarkdownRenderer();
  return (mkdown: string) => md.render(mkdown);
}
