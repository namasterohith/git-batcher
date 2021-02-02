# Git Batcher

Utility scripts for running batch jobs for git

## Usage

- Set configuration in `src/config/repos.js`.
- Run `npm run clone` from the project root to create all cloned repositories.
- Run `npm run merge` from the project root to perform merge/reset etc., on all cloned repositories.
- Use `scrapGitLabRposDetails()` helper to scrap repository details from GitLab group page.
