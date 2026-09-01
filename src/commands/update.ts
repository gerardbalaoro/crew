import { intro, outro, spinner } from "@clack/prompts";
import { message } from "@optique/core/message";
import { defineCommand } from "@optique/discover/command";

import { harnessFilter } from "#harnesses/select";

import { withAppContext } from "../app.ts";

export default defineCommand({
  path: ["update"],
  metadata: {
    aliases: ["u"],
    description: message`Update installed Crew agents.`,
  },
  parser: harnessFilter,
  handler: withAppContext(async (_, { global, harnesses }) => {
    intro("Updating Crew Agents");

    for (const harness of harnesses) {
      const spin = spinner();

      spin.start(harness.name);
      await harness.apply({ global });
      spin.stop();
    }

    outro("Done");
  }),
});
