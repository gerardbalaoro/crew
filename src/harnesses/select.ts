import { isCancel, multiselect } from "@clack/prompts";
import { multiple, object, option, or } from "@optique/core";
import { message } from "@optique/core/message";
import { string } from "@optique/core/valueparser";

import { Harnesses } from "#harnesses";

import type { Harness } from "./define";

export type HarnessFilter = {
  readonly all: boolean;
  readonly only: readonly string[];
};

const HarnessFilterPresets = {
  all: () => ({ all: true, only: [] }),
  only: (ids: readonly string[]) => ({ all: false, only: ids }),
  prompt: () => ({ all: false, only: [] }),
};

export const harnessFilter = or(
  object({
    all: option("--all", {
      description: message`Use all detected harnesses without prompting.`,
    }),
  }).map(() => HarnessFilterPresets.all()),
  object({
    only: multiple(
      option("--only", string(), {
        description: message`Use only the specified detected harness. Repeat for multiple harnesses.`,
      }),
      { min: 1 },
    ),
  }).map(({ only }) => HarnessFilterPresets.only(only)),
  object({}).map(() => HarnessFilterPresets.prompt()),
);

export async function selectHarnesses(
  detected: readonly Harness[],
  selection: HarnessFilter,
): Promise<readonly Harness[]> {
  if (detected.length === 0 || selection.all) {
    return detected;
  }

  if (selection.only.length > 0) {
    const unsupported = selection.only.filter((id) => !Harnesses.find((h) => h.id === id));

    if (unsupported.length > 0) {
      throw new Error(`Harnesses not supported: ${unsupported.join(", ")}.`);
    }

    return detected.filter((harness) => selection.only.includes(harness.id));
  }

  const selected = await multiselect({
    message: "Choose target harnesses.",
    options: detected.map((harness) => ({ value: harness.id, label: harness.name })),
    initialValues: detected.map((harness) => harness.id),
    required: true,
  });

  if (isCancel(selected)) {
    return [];
  }

  return detected.filter((harness) => selected.includes(harness.id));
}
