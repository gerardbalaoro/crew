# Agent Instructions

Discover the resources below when your work is relevant to it.

- [Domain Language and Project Context](./CONTEXT.md)
- [Git Conventions: Commits, Branches, and Pull Requests](.agents/rules/git.md)
- [TypeScript and JavaScript Rules](.agents/rules/typescript.md)
- [Writing Tests, Mocks, and Test Helpers](.agents/rules/testing.md)

## Linting and Formatting

- Use `bun run lint` and `bun run format` instead of calling directly.
- Pass `--format=agents` to `lint` and `format` scripts.
- Avoid suppressing lint rules in a file or line, refactor to fix.
