#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const { clone } = require('../src/clone');
const { mergeRepos } = require('../src/merge-repos');
const { mergeBranches } = require('../src/merge-branches');

const HELP_TEXT = `
Git Batcher

Usage:
  npx git-batcher <command> [options]

Commands:
  clone             Batch clone repositories from config
  merge-repos       Batch merge with hard reset for multi-repo workflows
  merge-branches    Merge a source branch into all configured target branches
  init              Create a custom or default config file if it doesn't exist
  help              Show this help message

Options:
  -c, --config      Path to a custom configuration file (default: ./git-batcher.config.js)
`;

const DEFAULT_CONFIG_CONTENT_CJS = `module.exports = {
  // Config for 'clone' and 'merge-repos' commands
  repos: [
    // { url: "group/repo-name", hash: "commit-hash-to-reset-to" }
  ],
  reposConfig: {
    // BASE_URL: "https://gitlab.com/",
    // BASE_EXT: ".git",
    SOURCE_BRANCH: "release",
    TARGET_BRANCH: "main",
    DEFAULT_BRANCH_NAME: "main"
  },

  // Config for 'merge-branches' command
  branchesConfig: {
    SOURCE_BRANCH: "main",
    targetBranches: [
      // { name: "Client A", branch: "client/client-a" },
    ]
  }
};
`;

const DEFAULT_CONFIG_CONTENT_ESM = `export default {
  // Config for 'clone' and 'merge-repos' commands
  repos: [
    // { url: "group/repo-name", hash: "commit-hash-to-reset-to" }
  ],
  reposConfig: {
    // BASE_URL: "https://gitlab.com/",
    // BASE_EXT: ".git",
    SOURCE_BRANCH: "release",
    TARGET_BRANCH: "main",
    DEFAULT_BRANCH_NAME: "main"
  },

  // Config for 'merge-branches' command
  branchesConfig: {
    SOURCE_BRANCH: "main",
    targetBranches: [
      // { name: "Client A", branch: "client/client-a" },
    ]
  }
};
`;

async function loadConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    console.error(`\n❌ Configuration file not found at:\n   ${configPath}\n`);
    console.log(`Run 'npx git-batcher init' to create a default configuration file.\n`);
    process.exit(1);
  }

  try {
    const fileUrl = require('url').pathToFileURL(configPath).href;
    const config = await import(fileUrl);
    return config.default || config;
  } catch (err) {
    if (err.message && err.message.includes('module is not defined')) {
      console.error(`\n❌ Error loading configuration file:\n   The file is treated as an ES module due to package.json, but uses CommonJS syntax.\n   Please change 'module.exports =' to 'export default' in ${configPath}\n`);
      process.exit(1);
    }
    try {
      return require(configPath);
    } catch (fallbackErr) {
      console.error(`\n❌ Error loading configuration file:\n   ${err.message}\n`);
      process.exit(1);
    }
  }
}

async function run() {
  const args = process.argv.slice(2);
  let configPath = path.resolve(process.cwd(), 'git-batcher.config.js');
  let command = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--config' || arg === '-c') {
      if (i + 1 < args.length) {
        configPath = path.resolve(process.cwd(), args[i + 1]);
        i++;
      } else {
        console.error('❌ Missing value for --config option');
        process.exit(1);
      }
    } else if (!command) {
      command = arg;
    }
  }

  switch (command) {
    case 'init': {
      if (fs.existsSync(configPath)) {
        console.log(`\n⚠️  Configuration file already exists at:\n   ${configPath}\n`);
      } else {
        let isESM = false;
        try {
          const pkgPath = path.resolve(process.cwd(), 'package.json');
          if (fs.existsSync(pkgPath)) {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
            if (pkg.type === 'module') isESM = true;
          }
        } catch (e) {}
        
        fs.writeFileSync(configPath, isESM ? DEFAULT_CONFIG_CONTENT_ESM : DEFAULT_CONFIG_CONTENT_CJS);
        console.log(`\n✅ Created default configuration file at:\n   ${configPath}\n`);
      }
      break;
    }
    
    case 'clone': {
      const config = await loadConfig(configPath);
      if (!config.repos || config.repos.length === 0) {
        console.error('❌ "repos" array is empty or missing in git-batcher.config.js');
        process.exit(1);
      }
      clone(config.repos, config.reposConfig);
      break;
    }

    case 'merge-repos': {
      const config = await loadConfig(configPath);
      if (!config.repos || config.repos.length === 0) {
        console.error('❌ "repos" array is empty or missing in git-batcher.config.js');
        process.exit(1);
      }
      if (!config.reposConfig) {
        console.error('❌ "reposConfig" object is missing in git-batcher.config.js');
        process.exit(1);
      }
      await mergeRepos(config.repos, config.reposConfig);
      break;
    }

    case 'merge-branches': {
      const config = await loadConfig(configPath);
      if (!config.branchesConfig || !config.branchesConfig.targetBranches) {
        console.error('❌ "branchesConfig.targetBranches" array is missing in git-batcher.config.js');
        process.exit(1);
      }
      await mergeBranches(config.branchesConfig);
      break;
    }

    case 'help':
    case '--help':
    case '-h':
    default: {
      console.log(HELP_TEXT);
      if (command && !['help', '--help', '-h'].includes(command)) {
        console.error(`❌ Unknown command: ${command}\n`);
        process.exit(1);
      }
      break;
    }
  }
}

run().catch(err => {
  console.error('\n❌ An unexpected error occurred:\n', err);
  process.exit(1);
});
