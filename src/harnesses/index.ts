import type { Harness, HarnessActionOptions } from "./define";

import Claude from "./claude/harness";
import Codex from "./codex/harness";
import Omp from "./omp/harness";
import OpenCode from "./opencode/harness";

export const Harnesses: Harness[] = [Claude, OpenCode, Omp, Codex].toSorted((a, b) =>
  a.name.localeCompare(b.name),
);

export type { Harness, HarnessActionOptions };

export async function detect(): Promise<Harness[]> {
  const harnesses: Harness[] = [];

  await Promise.all(
    Harnesses.map(async (harness) => {
      if (await harness.detect()) {
        harnesses.push(harness);
      }
    }),
  );

  return harnesses;
}
