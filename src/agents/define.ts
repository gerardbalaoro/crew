export type AgentPermissions = {
  execute?: boolean;
  fetch?: boolean;
  read?: boolean;
  write?: boolean;
  delegate?: boolean | string[];
};

export type Agent = {
  name: string;
  type: "main" | "worker" | "general";
  description?: string | undefined;
  permission?: AgentPermissions;
  prompt: string;
};

export function defineAgent<const Definition extends Agent>(definition: Definition): Definition {
  return definition;
}
