const { repos, SOURCE_BRANCH, TARGET_BRANCH } = require("./config/repos.js");
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

async function job() {
  console.log("Starting Batch Job!");
  for (i in repos) {
    console.log(repos[i]);
    shell.cd(`${REPOS_STORE}/${repos[i].url}`);
    console.log(shell.ls());

    // Reset HEAD If Needed
    shell.exec(`git reset --hard ${repos[i].hash}`);
    shell.exec(`git push -f origin ${SOURCE_BRANCH}`);
    console.log("Dev Reset");

    shell.exec(`git fetch origin`);
    shell.exec(`git checkout -b beta origin/${TARGET_BRANCH}`);

    // Merge
    await merge(SOURCE_BRANCH, TARGET_BRANCH);

    shell.exec(`git checkout ${SOURCE_BRANCH}`);
    shell.cd(`../../`);
  }
  console.log("Finished Batch Job!");
}

job();
