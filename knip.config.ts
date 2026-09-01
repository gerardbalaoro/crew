import { existsSync } from "node:fs";

import { AgentConfigLocations } from "./oxlint.config.ts";

const ExistingAgentConfigLocations = AgentConfigLocations.filter((pattern) =>
  existsSync(pattern.replace(/\/\*\*$/, "")),
);

export default {
  ignore: ExistingAgentConfigLocations,
  entry: ["tests/**/*.test.ts"],
  project: ["src/**/*.ts", "tests/**/*.ts"],
};
