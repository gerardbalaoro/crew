import { readFile, writeFile } from "node:fs/promises";

import { AgentList } from "#agents";

const README_PATH = "README.md";
const START = "<!-- agents: start -->";
const END = "<!-- agents: end -->";

type Cell = string[];

function agentRows(): Cell[][] {
  return [
    [["Agent"], ["Description"]],
    ...AgentList.map((agent): Cell[] => [[agent.name], [agent.description ?? ""]]),
  ];
}

function renderTable(rows: Cell[][]): string {
  const lines = rows.map((row) => [row[0]!.join("<br>"), row[1]!.join("<br>")] as const);
  const nameWidth = Math.max(...lines.map(([name]) => name.length));
  const width = Math.max(...lines.map(([, description]) => nameWidth + description.length)) + 7;
  const descriptionWidth = width - nameWidth - 7;

  const line = ([name, description]: readonly [string, string]) =>
    `| ${name.padEnd(nameWidth)} | ${description.padEnd(descriptionWidth)} |`;
  const separator = `| ${"-".repeat(nameWidth)} | ${"-".repeat(descriptionWidth)} |`;

  const [header, ...body] = lines;
  return [line(header!), separator, ...body.map(line)].join("\n");
}

const readme = await readFile(README_PATH, "utf8");
const startIndex = readme.indexOf(START);
const endIndex = readme.indexOf(END);

if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
  console.error(`Missing ${START} / ${END} markers in ${README_PATH}.`);
  process.exit(1);
}

const updated =
  readme.slice(0, startIndex + START.length) +
  "\n\n" +
  renderTable(agentRows()) +
  "\n\n" +
  readme.slice(endIndex);
if (updated === readme) {
  process.exit(0);
}

await writeFile(README_PATH, updated);
console.log(`Updated agents table in ${README_PATH}.`);
