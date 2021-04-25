const shell = require("shelljs");

const { repos, SOURCE_BRANCH, TARGET_BRANCH } = require("./config/repos.js");
const askQuestion = require("./ask-user.js");
const { pull } = require("./pull.js");

const REPOS_STORE = "repositories";

async function merge(source, target) {
  shell.exec(`git checkout ${target}`);
  await pull(target);
  console.log(`Merging ${source} to ${target}...`);
  shell.exec(`git merge ${source}`);
  const ans = await askQuestion("Merge Completed? Press Enter to Continue ");
  shell.exec(`git push origin ${target}`);
  console.log(`${target} Merged`);
}

async function job() {
  console.log("Starting Batch Job - Merge!");
  for (i in repos) {
    console.log(repos[i]);
    shell.cd(`${REPOS_STORE}/${repos[i].url}`);
    console.log(shell.ls());

    // Reset HEAD if needed
    shell.exec(`git reset --hard ${repos[i].hash}`);
    shell.exec(`git push -f origin ${SOURCE_BRANCH}`);
    console.log("Dev Reset");

    // Merge
    await merge(SOURCE_BRANCH, TARGET_BRANCH);

    shell.exec(`git checkout ${SOURCE_BRANCH}`);
    shell.cd(`../../`);
  }
  console.log("Finished Batch Job - Merge!");
}

module.exports = { merge, job };
