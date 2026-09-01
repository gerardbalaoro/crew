# Command-Local Harness Operations Design

## Goal

Remove `src/commands/shared.ts` while making `uninstall` and `update` follow the workflow established by `install.ts`.

## Design

`uninstall.ts` and `update.ts` will each import `harnessFilter` from `#harnesses/select` and implement their operation directly in the command handler.

Each handler will:

1. Display an operation-specific intro.
2. Create and start one Clack spinner per selected harness.
3. Invoke the operation on that harness with `{ global }`.
4. Stop the spinner.
5. Display `Done` as the outro.

Uninstall calls `harness.remove({ global })`; update calls `harness.apply({ global })`, matching the existing install behavior for writes. Each spinner uses the current harness name as its label so multiple harnesses remain distinguishable.

## Scope

- Modify `src/commands/uninstall.ts`.
- Modify `src/commands/update.ts`.
- Delete `src/commands/shared.ts`.
- Do not change harness selection, app context, or unrelated commands.

## Verification

Run the repository TypeScript check and targeted command smoke checks sufficient to confirm that all command imports resolve and each operation reaches its harness method without the deleted module.
