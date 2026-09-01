import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);

export async function which(command: string): Promise<boolean> {
  const lookup = process.platform === "win32" ? "where" : "which";

  try {
    const { stdout } = await exec(lookup, [command]);

    return stdout.toString().trim().length > 0;
  } catch {
    return false;
  }
}
