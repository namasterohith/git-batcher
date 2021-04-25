const shell = require("shelljs");

const { repos, SOURCE_BRANCH, TARGET_BRANCH } = require("./config/repos.js");
const { merge } = require("./merge.js");

const REPOS_STORE = "repositories";

async function reset(hash) {
  shell.exec(`git reset --hard ${hash}`);
  shell.exec(`git push -f origin ${SOURCE_BRANCH}`);
  console.log(`${SOURCE_BRANCH} Reset to ${hash}`);
}

async function job() {
  console.log("Starting Batch Job - Reset!");
  for (i in repos) {
    console.log(repos[i]);
    shell.cd(`${REPOS_STORE}/${repos[i].url}`);
    console.log(shell.ls());

    // Reset HEAD if needed
    await reset(repos[i].hash);

    shell.exec(`git fetch origin`);
    shell.exec(`git checkout -b ${TARGET_BRANCH} origin/${TARGET_BRANCH}`);

    // Merge
    await merge(SOURCE_BRANCH, TARGET_BRANCH);

    shell.exec(`git checkout ${SOURCE_BRANCH}`);
    shell.cd(`../../`);
  }
  console.log("Finished Batch Job - Reset!");
}

module.exports = { reset, job };
