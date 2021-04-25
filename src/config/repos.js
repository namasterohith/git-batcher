// Sample Configuration

// const GROUP_NAME = "foo-bar";
// const PROVIDER = "gitlab.com";
// const BASE_URL = `git@${PROVIDER}:${GROUP_NAME}/`;
// const BASE_EXT = ".git";
// const SOURCE_BRANCH = "dev";
// const TARGET_REMOTE = "origin"; //"usptream";
// const TARGET_BRANCH =
// "beta";
// //"production";

// const repos = [
//   {
//     name: "Foo Bar",
//     url: "master-data-service",
//     hash: "HEAD",
//   },
// ];

// /Sample Configuration

// Import Config For Current Task
const {
  repos,
  PROVIDER,
  GROUP_NAME,
  BASE_URL,
  BASE_EXT,
  SOURCE_REMOTE,
  SOURCE_BRANCH,
  TARGET_REMOTE,
  TARGET_BRANCH,
} = require("./backend-repos.js");

module.exports = {
  repos,
  PROVIDER,
  GROUP_NAME,
  BASE_URL,
  BASE_EXT,
  SOURCE_REMOTE,
  SOURCE_BRANCH,
  TARGET_REMOTE,
  TARGET_BRANCH,
};
