import { intro, taskLog } from "@clack/prompts";
import { object } from "@optique/core";
import { message } from "@optique/core/message";
import { defineCommand } from "@optique/discover/command";

import { Harnesses } from "#harnesses";

import { AgentList } from "../agents/index.ts";
import { withAppContext } from "../app.ts";

export default defineCommand({
  path: ["list"],
  metadata: {
    aliases: ["ls"],
    description: message`List Crew agents installed in your harnesses.`,
  },
  parser: object({}),
  handler: withAppContext(async (_, { global }) => {
    const all = AgentList.map((agent) => agent.name);

    intro("Crew Agents");

    for (const harness of Harnesses) {
      const log = taskLog({ title: harness.name, retainLog: true });
      const present = await harness.list({ global });
      const missing = all.filter((name) => !present.includes(name));

      log.message(`Installed: ${present.length > 0 ? present.join(", ") : "None"}`);
      log.message(`Missing: ${missing.length > 0 ? missing.join(", ") : "None"}`);
    }
  }),
});
