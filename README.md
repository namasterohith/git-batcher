# Git Batcher

Utility scripts for running batch git operations.

## Available Jobs

| Command | Description |
|---------|-------------|
| `npm run clone` | Batch clone repositories from a git group |
| `npm run merge-repos` | Batch merge with optional hard reset (for multi-repo release workflows) |
| `npm run merge-branches` | Merge a source branch into all configured target branches (for white-label workflows) |

## Usage

### Clone Repositories

1. Set configuration in `src/config/repos.js`.
2. Run `npm run clone` to clone all repositories into `repositories/`.

### Merge Repos (Multi-Repo Workflow)

1. Set configuration in `src/config/repos.js`.
2. Run `npm run merge-repos` to perform merge/reset on all repositories.

### Merge Branches (White-Label Workflow)

1. Set configuration in `src/config/branches.js`.
2. Run `npm run merge-branches` to perform merge on all branches.

### Helpers

- Use `scrapGitLabRposDetails()` in browser console to extract repository details from a GitLab group page.
