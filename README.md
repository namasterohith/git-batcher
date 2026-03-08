# Git Batcher

Utility scripts for running batch git operations across multiple repositories or branches.

## Installation

Install globally:

```bash
npm install -g git-batcher
```

Or run via npx without installing:

```bash
npx git-batcher <command>
```

## Configuration

`git-batcher` uses a configuration file (default: `git-batcher.config.js`) in the directory where you run the command.

To generate a default config file:

```bash
npx git-batcher init
```

You can pass a custom config file path to any command using the `-c` or `--config` flag:

```bash
npx git-batcher <command> -c path/to/custom.config.js
```

## Available Commands

| Command | Description |
| --------- | ------------- |
| `npx git-batcher init` | Generate a `git-batcher.config.js` in the current directory |
| `npx git-batcher clone` | Batch clone repositories defined in `config.repos` |
| `npx git-batcher merge-repos` | Batch merge with optional hard reset (for multi-repo release workflows) using `config.reposConfig` |
| `npx git-batcher merge-branches` | Merge a source branch into all configured target branches (for white-label workflows) using `config.branchesConfig` |

## Helpers

- Use `scrapGitLabRposDetails()` in browser console to extract repository details from a GitLab group page.
