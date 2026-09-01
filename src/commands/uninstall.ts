import { intro, outro, spinner } from "@clack/prompts";
import { message } from "@optique/core/message";
import { defineCommand } from "@optique/discover/command";

import { harnessFilter } from "#harnesses/select";

import { withAppContext } from "../app.ts";

export default defineCommand({
  path: ["uninstall"],
  metadata: {
    aliases: ["remove", "rm"],
    description: message`Remove Crew agents from your harnesses.`,
  },
  parser: harnessFilter,
  handler: withAppContext(async (_, { global, harnesses }) => {
    intro("Removing Crew Agents");

    for (const harness of harnesses) {
      const spin = spinner();

      spin.start(harness.name);
      await harness.remove({ global });
      spin.stop();
    }

    outro("Done");
  }),
});
