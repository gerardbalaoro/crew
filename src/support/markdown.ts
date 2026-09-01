import matter from "gray-matter";

type MarkdownValue = string | number | bigint | boolean | null | undefined;
export type MarkdownData = {
  [key: string]: MarkdownValue | MarkdownValue[] | Record<string, MarkdownValue | MarkdownValue[]>;
};

export function renderMarkdown(content: string, data: MarkdownData): string {
  return matter.stringify(content, data);
}

export function markdown(strings: TemplateStringsArray, ...values: MarkdownValue[]): string {
  let source = strings[0] ?? "";

  for (let index = 0; index < values.length; index += 1) {
    source += String(values[index] ?? "") + (strings[index + 1] ?? "");
  }

  const lines = source.replace(/^\n|\n\s*$/g, "").split("\n");
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^\s*/)?.[0].length ?? 0);
  const indent = indents.length > 0 ? Math.min(...indents) : 0;

  return lines
    .map((line) => line.slice(indent))
    .join("\n")
    .trim();
}
