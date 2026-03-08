const fetchUrl = require("./fetch.js");
const shell = require("shelljs");

const REPOS_STORE = "repositories";

function clone(repos) {
  console.log(`\n=== Cloning Repositories ===`);
  
  if (!shell.test('-d', REPOS_STORE)) {
    shell.mkdir('-p', REPOS_STORE);
  }
  
  shell.cd(REPOS_STORE);

  for (let i in repos) {
    const url = fetchUrl(repos[i].url);
    console.log(`Cloning ${url}...`);
    shell.exec("git clone " + url);
  }

  shell.cd(`../`);
  console.log(`\n✅ Finished cloning to ./${REPOS_STORE}/\n`);
}

module.exports = { clone };
