import { homedir } from "node:os";
import { join } from "node:path";

export const UserHome = homedir();
export const UserConfig = process.env.XDG_CONFIG_HOME ?? join(UserHome, ".config");
