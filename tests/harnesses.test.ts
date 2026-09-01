import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

import { AgentList } from "../src/agents/index.ts";
import { Harnesses } from "../src/harnesses/index.ts";

describe("harness adapters", () => {
  test("applies, lists, and removes all agent files", async () => {
    const root = await mkdtemp(join(tmpdir(), "crew-harness-test-"));
    const previousEnvironment = {
      CODEX_HOME: process.env.CODEX_HOME,
      OPENCODE_CONFIG_DIR: process.env.OPENCODE_CONFIG_DIR,
      PI_CODING_AGENT_DIR: process.env.PI_CODING_AGENT_DIR,
    };
    const names = AgentList.map((agent) => agent.name);

    process.env.CODEX_HOME = join(root, "codex");
    process.env.OPENCODE_CONFIG_DIR = join(root, "opencode");
    process.env.PI_CODING_AGENT_DIR = join(root, "omp");

    try {
      for (const harness of Harnesses) {
        expect(await harness.apply({ global: true })).toBe(names.length);
        expect((await harness.list({ global: true })).sort()).toEqual(names);
      }

      for (const harness of Harnesses) {
        expect(await harness.remove({ global: true })).toBe(names.length);
        expect(await harness.list({ global: true })).toEqual([]);
      }
    } finally {
      await rm(root, { recursive: true, force: true });

      for (const [name, value] of Object.entries(previousEnvironment)) {
        if (value === undefined) {
          delete process.env[name];
        } else {
          process.env[name] = value;
        }
      }
    }
  });

  test("remove ignores files from other tools", async () => {
    const root = await mkdtemp(join(tmpdir(), "crew-foreign-test-"));
    const previousEnvironment = {
      CODEX_HOME: process.env.CODEX_HOME,
      OPENCODE_CONFIG_DIR: process.env.OPENCODE_CONFIG_DIR,
      PI_CODING_AGENT_DIR: process.env.PI_CODING_AGENT_DIR,
    };

    process.env.CODEX_HOME = join(root, "codex");
    process.env.OPENCODE_CONFIG_DIR = join(root, "opencode");
    process.env.PI_CODING_AGENT_DIR = join(root, "omp");

    try {
      for (const harness of Harnesses) {
        expect(await harness.remove({ global: true })).toBe(0);
      }
    } finally {
      await rm(root, { recursive: true, force: true });

      for (const [name, value] of Object.entries(previousEnvironment)) {
        if (value === undefined) {
          delete process.env[name];
        } else {
          process.env[name] = value;
        }
      }
    }
  });
});
