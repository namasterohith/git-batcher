const { repos, SOURCE_BRANCH, TARGET_BRANCH } = require("./config/repos.js");
const askQuestion = require("./ask-user.js");

const shell = require("shelljs");

const REPOS_STORE = "repositories";

async function pull(target) {
  console.log(`Pulling from ${target}`);
  shell.exec(`git checkout ${target}`);
  shell.exec(`git pull origin ${target}`);
  const ans = await askQuestion("Pull Completed? Press Enter to Continue ");
}

async function job() {
  console.log("Starting Batch Job - Pull!");
  for (i in repos) {
    console.log(repos[i]);
    shell.cd(`${REPOS_STORE}/${repos[i].url}`);

    shell.exec(`git fetch origin`);

    // pull
    await pull(TARGET_BRANCH);

    shell.cd(`../../`);
  }
  console.log("Finished Batch Job - Pull!");
}

module.exports = { pull, job };
