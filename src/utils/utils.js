const chalk = require('chalk');

/**
 * Function should build a separate array for each unique remote
 *
 * @param {Array} output Array containing an array of branch information
 * @return {Object} Object with key-value pairs of remote-branchArray
 */
function buildRemotePayload(output) {
  let payload = {};

  const remoteList = filterUniqueRemotes(output);

  remoteList.forEach(branch => {
    payload[branch] = [];
  });

  output.forEach(remote => {
    payload[remote[1]].push(remote);
  });

  return payload;
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

/**
 * Find unique remotes in repository
 *
 * @param {Array} output Array containing an array of branch information
 * @return {Array} Array containing a unique set of remotes for this repository
 */
function filterUniqueRemotes(output) {
  let remoteList = [];

  output.forEach(remote => remoteList.push(remote[1]));

  remoteList = remoteList.filter(onlyUnique).sort();

  return remoteList;
}

/**
 * Get "tabs" for status bar highlighting current remote
 *
 * @param {Array} remoteList - Array of unique remotes
 * @param {String} currentRemote - Name of current remote
 *
 * @return {Array} Copy of remoteList with currentRemote inverted with chalk
 */
function getRemoteTabs(remoteList, currentRemote) {
  const focusedIndex = remoteList.indexOf(currentRemote);

  const focusedRemoteList = remoteList.slice();

  focusedRemoteList[focusedIndex] = chalk.inverse(currentRemote);

  return focusedRemoteList.join(':');
}

module.exports = {
  buildRemotePayload,
  filterUniqueRemotes,
  onlyUnique,
  getRemoteTabs,
};