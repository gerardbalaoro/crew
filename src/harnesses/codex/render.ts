import type { Agent, AgentPermissions } from "#agents";

import { renderToml } from "#support/toml";

export function render(agent: Agent): string {
  const permission: AgentPermissions = agent.permission ?? {};

  return renderToml({
    name: agent.name,
    description: agent.description ?? "",
    sandbox_mode: permission.write === true ? "workspace-write" : "read-only",
    developer_instructions: agent.prompt.trim(),
  });
}
