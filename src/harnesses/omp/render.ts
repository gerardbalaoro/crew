import type { Agent } from "#agents";

import { renderMarkdown, type MarkdownData } from "#support/markdown";

function tools(permission: NonNullable<AgentPermissions>): string[] {
  const enabled: string[] = [];

  if (permission.read === true) {
    enabled.push("read", "glob", "grep");
  }
  if (permission.execute === true) {
    enabled.push("bash");
  }
  if (permission.write === true) {
    enabled.push("edit", "write");
  }
  if (permission.fetch === true) {
    enabled.push("browser", "web_search");
  }
  if (permission.delegate !== false) {
    enabled.push("task");
  }

  return enabled;
}

type AgentPermissions = NonNullable<Agent["permission"]>;

function frontmatter(agent: Agent, permission: AgentPermissions): MarkdownData {
  const data: MarkdownData = {};
  data.name = agent.name;
  data.description = agent.description ?? "";
  data.tools = tools(permission);

  if (permission.delegate !== undefined && permission.delegate !== false) {
    data.spawns = permission.delegate === true ? "*" : permission.delegate;
  }

  return data;
}

export function render(agent: Agent): string {
  return renderMarkdown(agent.prompt.trim(), frontmatter(agent, agent.permission ?? {}));
}
