export type HarnessActionOptions = {
  global?: boolean;
};

export type Harness = {
  id: string;
  name: string;
  detect(): Promise<boolean>;
  list(options: HarnessActionOptions): Promise<string[]>;
  apply(options: HarnessActionOptions): Promise<number>;
  remove(options: HarnessActionOptions): Promise<number>;
};

export function defineHarness<const Definition extends Harness>(
  definition: Definition,
): Definition {
  return definition;
}
