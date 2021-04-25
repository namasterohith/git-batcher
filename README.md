# Git Batcher

Node based utility scripts for running batch jobs for git.

## Available jobs

- Clone.
- Merge (with reset for optional source branch).

## Usage

- Run `npm i` from the project root to intall all the dependencies.
- Set configuration in `src/config/repos.js`.
- Run `npm git-batcher clone` from the project root to create all cloned repositories.
- Run `npm git-batcher merge` from the project root to perform merge/reset etc., on all cloned repositories.

### Additional Helpers

- Use `scrapGitLabRposDetails()` helper to scrap repository details from GitLab group page.

## Requirements

- Git
- Node.js
