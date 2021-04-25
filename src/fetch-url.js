const { BASE_URL, BASE_EXT } = require("./config/repos.js");

function fetchUrl(service) {
  return BASE_URL + service + BASE_EXT;
}

module.exports = fetchUrl;
