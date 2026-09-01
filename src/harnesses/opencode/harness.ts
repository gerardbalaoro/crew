import { glob } from "globlin";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { basename, join } from "node:path";

import { AgentList, type Agent } from "#agents";
import { defineHarness } from "#harnesses/define";
import { UserConfig } from "#support/locations";
import { which } from "#support/utils";

import { render } from "./render";

function getDirectory(global?: boolean) {
  if (global) {
    return process.env.OPENCODE_CONFIG_DIR ?? join(UserConfig, "opencode");
  }

  return join(process.cwd(), ".opencode");
}

const listFiles = async (location: string) => {
  const files: Array<{ name: string; path: string }> = [];
  const paths = await glob("*.md", { cwd: location, absolute: true });

  for (const path of paths) {
    const name = basename(path, ".md");

    if (AgentList.find((agent) => agent.name === name)) {
      files.push({ name, path });
      continue;
    }
  }

  return files;
};

export default defineHarness({
  id: "opencode",
  name: "OpenCode",
  detect: () => which("opencode"),
  list: async (options) => {
    const files = await listFiles(getDirectory(options.global));

    return files.map((file) => file.name);
  },
  apply: async (options) => {
    const directory = getDirectory(options.global);
    const installedAgents: Agent[] = [];

    await mkdir(directory, { recursive: true });
    await Promise.all(
      AgentList.map(async (agent) => {
        const path = join(directory, `${agent.name}.md`);
        const contents = render(agent);

        await writeFile(path, contents, "utf-8");
        installedAgents.push(agent);
      }),
    );

    return installedAgents.length;
  },
  remove: async (options) => {
    const directory = getDirectory(options.global);
    const files = await listFiles(directory);
    const agentNames: string[] = [];

    await Promise.all(
      files.map(async (file) => {
        await rm(file.path);
        agentNames.push(file.name);
      }),
    );

    return agentNames.length;
  },
});
