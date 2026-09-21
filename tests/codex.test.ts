import { parse } from "smol-toml";
import { describe, expect, test } from "vitest";

import { defineAgent } from "#agents/define";
import { render } from "#harnesses/codex/render";

const agent = defineAgent({
  name: "probe",
  description: "Inspect a bounded question.",
  type: "worker",
  prompt: "\nReport the evidence.\n",
});

describe("Codex agent definitions", () => {
  test("renders native metadata without replacing Crew identity or leaking other harnesses", () => {
    const result = parse(
      render({
        ...agent,
        permission: { delegate: false },
        harness: {
          claude: { model: "opus", permissionMode: "plan" },
          codex: {
            name: "replacement",
            description: "Replacement description",
            developer_instructions: "Replacement instructions",
            model: "gpt-5.6-luna",
            model_reasoning_effort: "low",
            approval_policy: "on-request",
            agents: { max_concurrent_threads_per_session: 2 },
            mcp_servers: {
              docs: { command: "docs-server", args: ["--local"], enabled: true },
            },
            skills: { config: [{ path: "/skills/example/SKILL.md", enabled: false }] },
          },
        },
      }),
    );

    expect(result).toEqual({
      name: "probe",
      description: "Inspect a bounded question.",
      developer_instructions: "Report the evidence.",
      model: "gpt-5.6-luna",
      model_reasoning_effort: "low",
      approval_policy: "on-request",
      sandbox_mode: "read-only",
      web_search: "disabled",
      agents: { enabled: false, max_concurrent_threads_per_session: 2 },
      mcp_servers: {
        docs: { command: "docs-server", args: ["--local"], enabled: true },
      },
      skills: { config: [{ path: "/skills/example/SKILL.md", enabled: false }] },
    });
  });

  test.each([
    {
      permission: undefined,
      sandbox: "read-only",
      search: "disabled",
      delegates: true,
    },
    {
      permission: { write: true, fetch: true, delegate: true },
      sandbox: "workspace-write",
      search: "live",
      delegates: true,
    },
    {
      permission: { write: false, fetch: false, delegate: false },
      sandbox: "read-only",
      search: "disabled",
      delegates: false,
    },
    {
      permission: { delegate: ["recon", "scholar"] },
      sandbox: "read-only",
      search: "disabled",
      delegates: true,
    },
  ])("maps permissions $permission without pinning model settings", (scenario) => {
    const result = parse(render({ ...agent, permission: scenario.permission }));

    expect(result).toMatchObject({
      sandbox_mode: scenario.sandbox,
      web_search: scenario.search,
      agents: { enabled: scenario.delegates },
    });
    expect(result).not.toHaveProperty("model");
    expect(result).not.toHaveProperty("model_reasoning_effort");
    expect(result).not.toHaveProperty("approval_policy");
  });

  test("native permissions override Crew defaults and preserve nested sandbox settings", () => {
    const result = parse(
      render({
        ...agent,
        permission: { write: false, fetch: false, delegate: false },
        harness: {
          codex: {
            sandbox_mode: "workspace-write",
            sandbox_workspace_write: { network_access: true },
            web_search: "cached",
            agents: { enabled: true },
          },
        },
      }),
    );

    expect(result).toMatchObject({
      sandbox_mode: "workspace-write",
      sandbox_workspace_write: { network_access: true },
      web_search: "cached",
      agents: { enabled: true },
    });
  });

  test("permission profiles suppress the generated legacy sandbox mode", () => {
    const result = parse(
      render({
        ...agent,
        permission: { write: true },
        harness: {
          codex: {
            default_permissions: "project-edit",
            permissions: {
              "project-edit": { extends: ":workspace", network: { enabled: false } },
            },
          },
        },
      }),
    );

    expect(result).toMatchObject({
      default_permissions: "project-edit",
      permissions: {
        "project-edit": { extends: ":workspace", network: { enabled: false } },
      },
    });
    expect(result).not.toHaveProperty("sandbox_mode");
    expect(result).not.toHaveProperty("sandbox_workspace_write");
  });

  test.each([
    { key: "sandbox_mode", value: "read-only" },
    { key: "sandbox_workspace_write", value: { network_access: false } },
  ])("rejects $key alongside a permission profile", (config) => {
    expect(() =>
      render({
        ...agent,
        harness: {
          codex: { default_permissions: ":read-only", [config.key]: config.value },
        },
      }),
    ).toThrow("cannot combine default_permissions with legacy sandbox settings");
  });
});
