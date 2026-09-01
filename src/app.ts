import type { ProgramHookContext, ProgramInvocation } from "@optique/discover";

import { object, option, seq } from "@optique/core";
import { message } from "@optique/core/message";
import { createProgramParser } from "@optique/discover";
import { runAsync } from "@optique/run";

import { detect, type Harness } from "#harnesses";
import { type HarnessFilter, selectHarnesses } from "#harnesses/select";

import packageJson from "../package.json" with { type: "json" };

export type AppContext = {
  readonly global: boolean | undefined;
  readonly harnesses: readonly Harness[];
};

export function withAppContext<T>(
  handler: (options: T, context: AppContext) => void | Promise<void>,
): (options: T, context?: ProgramHookContext<AppContext>) => void | Promise<void> {
  return (options, context) => {
    if (context?.resource === undefined) {
      throw new Error("App context is unavailable.");
    }

    return handler(options, context.resource);
  };
}

type WriteCommand = ProgramInvocation & {
  readonly path: readonly ["install" | "uninstall" | "update", ...string[]];
  readonly value: HarnessFilter;
};

function isWriteCommand(invocation: ProgramInvocation): invocation is WriteCommand {
  const command = invocation.path[0];
  return command === "install" || command === "uninstall" || command === "update";
}

async function beforeEach(
  global: boolean | undefined,
  invocation: ProgramInvocation,
): Promise<{ resource: AppContext }> {
  const detected = await detect();

  return {
    resource: {
      global,
      harnesses: isWriteCommand(invocation)
        ? await selectHarnesses(detected, invocation.value)
        : detected,
    },
  };
}

export async function run(): Promise<void> {
  const commands = await Promise.all([
    import("./commands/list.ts"),
    import("./commands/install.ts"),
    import("./commands/uninstall.ts"),
    import("./commands/update.ts"),
  ]).then((modules) => modules.map(({ default: command }) => command));

  const parser = seq(
    object({
      global: option("-g", "--global", {
        description: message`Use global configuration.`,
      }),
    }),
    createProgramParser(
      commands.map((command) => ({ path: command.path, command })),
      {
        description: message`${packageJson.description}`,
      },
    ),
  );

  const [{ global }, invocation] = await runAsync(parser, {
    programName: packageJson.name.split("/").pop() || "",
    version: packageJson.version,
    description: message`${packageJson.description}`,
    help: "both",
    completion: "both",
  });

  await invocation.handler(invocation.value, await beforeEach(global, invocation));
}
