import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test, vi } from "vitest";

import Claude from "#harnesses/claude/harness";
import Codex from "#harnesses/codex/harness";
import Omp from "#harnesses/omp/harness";
import OpenCode from "#harnesses/opencode/harness";

import Architect from "../src/agents/$architect.ts";
import Engineer from "../src/agents/$engineer.ts";
import { AgentList } from "../src/agents/index.ts";
import { render as renderClaude } from "../src/harnesses/claude/render.ts";
import { render as renderCodex } from "../src/harnesses/codex/render.ts";
import { render as renderOmp } from "../src/harnesses/omp/render.ts";
import { render as renderOpenCode } from "../src/harnesses/opencode/render.ts";

describe("harness adapters", () => {
  describe.each([
    { scope: "global", global: true },
    { scope: "project", global: false },
  ])("$scope installations", (options) => {
    test.each([
      {
        harness: Claude,
        environment: "CLAUDE_CONFIG_DIR",
        project: ".claude/agents",
        directory: "agents",
        extension: ".md",
      },
      {
        harness: Codex,
        environment: "CODEX_HOME",
        project: ".codex/agents",
        directory: "agents",
        extension: ".toml",
      },
      {
        harness: Omp,
        environment: "PI_CODING_AGENT_DIR",
        project: ".omp/agents",
        directory: "agents",
        extension: ".md",
      },
      {
        harness: OpenCode,
        environment: "OPENCODE_CONFIG_DIR",
        project: ".opencode/agent",
        directory: "agent",
        extension: ".md",
      },
    ])("manages $harness.name agents in its discovery directory", async (scenario) => {
      const root = await mkdtemp(join(tmpdir(), "crew-harness-test-"));
      const config = join(root, "config");
      const directory = options.global
        ? join(config, scenario.directory)
        : join(root, scenario.project);
      const names = AgentList.map((agent) => agent.name);
      const foreign = join(directory, `foreign${scenario.extension}`);
      const existing = join(directory, `architect${scenario.extension}`);
      const cwd = vi.spyOn(process, "cwd").mockReturnValue(root);
      vi.stubEnv(scenario.environment, config);

      try {
        expect(await scenario.harness.list(options)).toEqual([]);
        expect(await scenario.harness.remove(options)).toBe(0);

        await mkdir(directory, { recursive: true });
        await writeFile(foreign, "Keep this foreign agent.");
        await writeFile(existing, "Outdated Crew agent.");
        expect(await scenario.harness.list(options)).toEqual(["architect"]);

        expect(await scenario.harness.apply(options)).toBe(names.length);
        expect((await readdir(directory)).sort()).toEqual(
          [...names, "foreign"].map((name) => `${name}${scenario.extension}`).sort(),
        );
        expect(await readFile(existing, "utf-8")).not.toBe("Outdated Crew agent.");
        expect((await scenario.harness.list(options)).sort()).toEqual(names);

        expect(await scenario.harness.remove(options)).toBe(names.length);
        expect(await scenario.harness.list(options)).toEqual([]);
        expect(await readdir(directory)).toEqual([`foreign${scenario.extension}`]);
        expect(await readFile(foreign, "utf-8")).toBe("Keep this foreign agent.");
      } finally {
        cwd.mockRestore();
        vi.unstubAllEnvs();
        await rm(root, { recursive: true, force: true });
      }
    });
  });
  test("harness config renders only into its own harness", () => {
    const renderForHarness = [
      { id: "claude", render: renderClaude },
      { id: "codex", render: renderCodex },
      { id: "omp", render: renderOmp },
      { id: "opencode", render: renderOpenCode },
    ];

    for (const { id, render } of renderForHarness) {
      const architect = render(Architect);
      const engineer = render(Engineer);

      if (id === "claude") {
        expect(architect).toContain("permissionMode: plan");
        expect(architect).toContain("model: opus");
        expect(architect).toContain("effort: medium");
      } else {
        expect(architect).not.toContain("permissionMode");
      }

      expect(engineer).not.toContain("permissionMode");
    }
  });
});
