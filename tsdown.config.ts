import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/bin.ts"],
  unbundle: true,
  format: "esm",
  outExtensions: () => ({ js: ".mjs" }),
  clean: true,
});
