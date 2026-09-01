#!/usr/bin/env node

import { log } from "@clack/prompts";

import { run } from "./app.ts";

try {
  await run();
} catch (error) {
  log.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
