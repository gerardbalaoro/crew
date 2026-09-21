# Crew

Crew is a small team of AI agents for **OpenCode**, **Oh My Pi**, **Codex**, and **Claude Code**.
It installs the same set of named agents into every supported harness available
on your machine.

## The Agents

<!-- agents: start -->

| Agent     | Description                                                                  |
| --------- | ---------------------------------------------------------------------------- |
| aide      | General-purpose assistant for everyday work.                                 |
| architect | Finalizes requirements and designs bounded implementation plans.             |
| captain   | Leads technical work, makes decisions, and coordinates specialist agents.    |
| engineer  | Implements one bounded technical change from clear direction.                |
| recon     | Explores available context and environments to establish scoped facts.       |
| scholar   | Researches external information and compares authoritative sources.          |
| sentinel  | Independently reviews bounded technical outcomes against clear requirements. |

<!-- agents: end -->

## Quick Start

```sh
npx -y @gblab/crew install
```

## Commands

| Command          | Description                                          |
| ---------------- | ---------------------------------------------------- |
| `crew install`   | Install Crew agents in your harnesses.               |
| `crew update`    | Update installed Crew agents.                        |
| `crew uninstall` | Remove Crew agents from your harnesses.              |
| `crew list`      | List installed and missing agents in your harnesses. |

### Global Mode

Manage the agents on your user-level configuration.

| Option         | Description               |
| -------------- | ------------------------- |
| `-g, --global` | Use global configuration. |

### Choose Target Harnesses

Pick harnesses to run `install`, `update`, and `uninstall`.

| Option           | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| `--all`          | Use all detected harnesses without prompting.                  |
| `--only HARNESS` | Use only the specified harness. Repeat for multiple harnesses. |

## Development

This project uses [mise](https://mise.jdx.dev/) for tools management
and [Bun](https://bun.sh/) for package management.

## Scripts

| Script           | Description              |
| ---------------- | ------------------------ |
| `bun run dev`    | Run the CLI from source. |
| `bun run test`   | Run tests.               |
| `bun run format` | Run code formatter.      |
| `bun run lint`   | Run the code linter.     |
