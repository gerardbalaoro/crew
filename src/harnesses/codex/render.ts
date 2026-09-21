import type { Agent, AgentPermissions } from "#agents";

import { renderToml, type TomlTable } from "#support/toml";

export function render(agent: Agent): string {
  const permission: AgentPermissions = agent.permission ?? {};
  const config = agent.harness?.codex ?? {};

  if (
    config.default_permissions !== undefined &&
    (config.sandbox_mode !== undefined || config.sandbox_workspace_write !== undefined)
  ) {
    throw new Error(
      `Codex agent "${agent.name}" cannot combine default_permissions with legacy sandbox settings.`,
    );
  }

  const table: TomlTable = {
    web_search: permission.fetch === true ? "live" : "disabled",
    ...config,
    name: agent.name,
    description: agent.description ?? "",
    developer_instructions: agent.prompt.trim(),
    agents: Object.assign({ enabled: permission.delegate !== false }, config.agents),
  };

  if (config.default_permissions === undefined) {
    table.sandbox_mode =
      config.sandbox_mode ?? (permission.write === true ? "workspace-write" : "read-only");
  }

  return renderToml(table);
}
