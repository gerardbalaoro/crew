import type { Agent, AgentPermissions } from "#agents";

import { renderMarkdown } from "#support/markdown";

function createMode(type: Agent["type"]) {
  switch (type) {
    case "main":
      return "primary";
    case "worker":
      return "subagent";
    case "general":
      return "all";
  }
}

function createRule(allow?: boolean) {
  return allow ? "allow" : "deny";
}

function createPermissions(permission: AgentPermissions) {
  return {
    read: createRule(permission.read),
    edit: createRule(permission.write),
    bash: createRule(permission.execute),
    webfetch: createRule(permission.fetch),
    task: Array.isArray(permission.delegate)
      ? permission.delegate
      : createRule(permission.delegate),
  };
}

function createTools(permission: AgentPermissions) {
  return {
    apply_patch: permission.write === true,
    bash: permission.execute === true,
    edit: permission.write === true,
    glob: permission.read === true,
    grep: permission.read === true,
    list: permission.read === true,
    read: permission.read === true,
    task: permission.delegate !== false,
    webfetch: permission.fetch === true,
    websearch: permission.fetch === true,
    write: permission.write === true,
  };
}

export function render(agent: Agent): string {
  const permission = agent.permission ?? {};

  return renderMarkdown(agent.prompt.trim(), {
    description: agent.description ?? "",
    mode: createMode(agent.type),
    permission: createPermissions(permission),
    tools: createTools(permission),
  });
}
