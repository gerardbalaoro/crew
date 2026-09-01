import { glob } from "globlin";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

import { AgentList, type Agent } from "#agents";
import { defineHarness } from "#harnesses/define";
import { UserHome } from "#support/locations";
import { which } from "#support/utils";

import { render } from "./render";

function getDirectory(global?: boolean) {
  if (global) {
    return join(process.env.PI_CODING_AGENT_DIR ?? join(UserHome, ".omp", "agent"), "agents");
  }

  return join(process.cwd(), ".omp", "agents");
}

const listFiles = async (location: string) => {
  const files: Array<{ name: string; path: string }> = [];
  const paths = await glob("*.md", { cwd: location, absolute: true });

  for (const path of paths) {
    const name = basename(path, ".md");

    if (AgentList.find((agent) => agent.name === name)) {
      files.push({ name, path });
    }
  }

  return files;
};

export default defineHarness({
  id: "omp",
  name: "Oh My Pi",
  detect: () => which("omp"),
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
