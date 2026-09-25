# Agent Instructions

Discover the resources below when your work is relevant to it.

- [Domain Language and Project Context](./CONTEXT.md)
- [Git Conventions: Commits, Branches, and Pull Requests](.agents/rules/git.md)
- [TypeScript and JavaScript Rules](.agents/rules/typescript.md)
- [Writing Tests, Mocks, and Test Helpers](.agents/rules/testing.md)

## Linting and Formatting

- Use `bun run lint` and `bun run format` instead of calling directly.
- Pass `--format=agent` to `lint`; `format` does not support a `--format` option.
- Avoid suppressing lint rules in a file or line, refactor to fix.

## Writing Agent Prompts

System prompts for agents should be concise and direct.

- Avoid repeating instructions already defined in another part of the prompt.
- Avoid providing very specific workflow instructions. Prompts should be general.
- Avoid over-instruction, treat each word as possible context bloat.
- Prose must be around 50-80 lines.
- Prose must be human-readable and well structured.
