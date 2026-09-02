export type AgentPermissions = {
  execute?: boolean;
  fetch?: boolean;
  read?: boolean;
  write?: boolean;
  delegate?: boolean | string[];
};

type HarnessConfigProperty = string | number | boolean;
type HarnessConfig = Record<string, HarnessConfigProperty | HarnessConfigProperty[]>;

export type Agent = {
  name: string;
  type: "main" | "worker" | "general";
  description?: string | undefined;
  harness?: Record<string, HarnessConfig>;
  permission?: AgentPermissions;
  prompt: string;
};

export function defineAgent<const Definition extends Agent>(definition: Definition): Definition {
  return definition;
}
