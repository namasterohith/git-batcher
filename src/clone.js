const repos = require("./config/repos.js");
const fetchUrl = require("./fetch-url.js");

const shell = require("shelljs");

const REPOS_STORE = "repositories";

shell.cd(REPOS_STORE);

for (i in repos) {
  shell.exec("git clone " + fetchUrl(repos[i].url));
}

shell.cd(`../`);
