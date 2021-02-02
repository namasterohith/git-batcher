// Chore Helper
// Run this on GitLab Group Page to scrap details

const { PROVIDER, GROUP_NAME } = require("./config/repos.js");

function scrapGitLabRposDetails() {
  let repos = [];
  const repoLinks = document.querySelectorAll('[data-testid="group-name"]');
  repoLinks.forEach(function (repoLink) {
    repos.push({
      name: repoLink.innerText,
      url: repoLink.href.split(`https://${PROVIDER}/${GROUP_NAME}/`)[1],
    });
  });
  return JSON.stringify(repos);
}
