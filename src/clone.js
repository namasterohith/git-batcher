const shell = require("shelljs");

const REPOS_STORE = "repositories";

function clone(repos, reposConfig = {}) {
  console.log(`\n=== Cloning Repositories ===`);
  
  if (!shell.test('-d', REPOS_STORE)) {
    shell.mkdir('-p', REPOS_STORE);
  }
  
  shell.cd(REPOS_STORE);

  const { BASE_URL = 'https://gitlab.com/', BASE_EXT = '.git' } = reposConfig || {};

  for (let i in repos) {
    const repoPath = repos[i].url;
    let url = repoPath;
    if (!url.startsWith('http') && !url.startsWith('git@')) {
      url = BASE_URL + url + BASE_EXT;
    }
    console.log(`Cloning ${url} into ${repoPath}...`);
    shell.exec(`git clone ${url} ${repoPath}`);
  }

  shell.cd(`../`);
  console.log(`\n✅ Finished cloning to ./${REPOS_STORE}/\n`);
}

module.exports = { clone };
