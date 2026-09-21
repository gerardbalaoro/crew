import { stringify } from "smol-toml";

export type TomlTable = { [key: string]: TomlValue };

type TomlValue = string | number | boolean | TomlTable | TomlValue[];

export function renderToml(table: TomlTable): string {
  return `${stringify(table)}\n`;
}
