const askQuestion = require("./ask-user.js");
const shell = require("shelljs");

const REPOS_STORE = "repositories";

async function merge(source, target) {
  shell.exec(`git checkout ${target}`);
  shell.exec(`git pull origin ${target}`);
  console.log(`Merging ${source} to ${target}...`);
  shell.exec(`git merge ${source}`);
  const ans = await askQuestion("Merge Completed? Press Enter to Continue ");
  shell.exec(`git push origin ${target}`);
  console.log(`${target} Merged`);
}

async function mergeRepos(repos, config) {
  const { SOURCE_BRANCH, TARGET_BRANCH, DEFAULT_BRANCH_NAME } = config;

  console.log("\n=== Starting Merge Repos Job ===");
  
  if (!shell.test('-d', REPOS_STORE)) {
    console.error(`❌ Repositories directory './${REPOS_STORE}' not found. Run 'clone' first.`);
    return;
  }

  for (let i in repos) {
    console.log(`\n--- Processing ${repos[i].url} ---`);
    shell.cd(`${REPOS_STORE}/${repos[i].url}`);
    
    // Reset HEAD if needed
    shell.exec(`git reset --hard ${repos[i].hash}`);
    shell.exec(`git push -f origin ${SOURCE_BRANCH}`);
    console.log(DEFAULT_BRANCH_NAME + " Reset");

    shell.exec(`git fetch origin`);
    shell.exec(`git checkout -b beta origin/${TARGET_BRANCH}`);

    // Merge
    await merge(SOURCE_BRANCH, TARGET_BRANCH);

    shell.exec(`git checkout ${SOURCE_BRANCH}`);
    shell.cd(`../../`);
  }
  console.log("\n✅ Finished Merge Repos Job!\n");
}

module.exports = { mergeRepos };
