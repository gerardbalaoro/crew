import { intro, outro, spinner } from "@clack/prompts";
import { message } from "@optique/core/message";
import { defineCommand } from "@optique/discover/command";

import { harnessFilter } from "#harnesses/select";

import { withAppContext } from "../app.ts";

export default defineCommand({
  path: ["install"],
  metadata: {
    aliases: ["i"],
    description: message`Install Crew agents in your harnesses.`,
  },
  parser: harnessFilter,
  handler: withAppContext(async (_, { global, harnesses }) => {
    intro("Installing Crew Agents");

    for (const harness of harnesses) {
      const spin = spinner();

      spin.start("OpenCode");
      await harness.apply({ global });
      spin.stop();
    }

    outro("Done");
  }),
});
