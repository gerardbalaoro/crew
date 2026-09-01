import Aide from "./$aide";
import Architect from "./$architect";
import Captain from "./$captain";
import Engineer from "./$engineer";
import Recon from "./$recon";
import Scholar from "./$scholar";
import Sentinel from "./$sentinel";

export { type Agent, type AgentPermissions } from "./define";

const Agents = {
  Aide,
  Architect,
  Captain,
  Engineer,
  Recon,
  Scholar,
  Sentinel,
} as const;

export const AgentList = Object.values(Agents).toSorted((a, b) => a.name.localeCompare(b.name));
