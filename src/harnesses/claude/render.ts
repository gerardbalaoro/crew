import type { Agent } from "#agents";

import { renderMarkdown } from "#support/markdown";

function tools(permission: NonNullable<Agent["permission"]>): string {
  const enabled: string[] = [];

  if (permission.read === true) {
    enabled.push("Read", "Glob", "Grep");
  }
  if (permission.execute === true) {
    enabled.push("Bash");
  }
  if (permission.write === true) {
    enabled.push("Edit", "Write");
  }
  if (permission.fetch === true) {
    enabled.push("WebFetch", "WebSearch");
  }
  if (permission.delegate !== false) {
    enabled.push("Task");
  }

  return enabled.join(", ");
}

export function render(agent: Agent): string {
  return renderMarkdown(agent.prompt.trim(), {
    name: agent.name,
    description: agent.description ?? "",
    tools: tools(agent.permission ?? {}),
    ...agent.harness?.claude,
  });
}
