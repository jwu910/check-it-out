const chalk = require('chalk');

/**
 * Function should build a separate array for each unique remote
 *
 * @param {Array} output Array containing an array of branch information
 * @return {Object} Object with key-value pairs of remote-branchArray
 */
export function buildRemotePayload(output) {
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
export function filterUniqueRemotes(output) {
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
export function getRemoteTabs(remoteList = ['local'], currentRemote) {
  const focusedIndex = remoteList.indexOf(currentRemote);

  const focusedRemoteList = remoteList.slice();

  focusedRemoteList[focusedIndex] = chalk.inverse(currentRemote);

  return focusedRemoteList.join(':');
}

/**
 * Handle errors and log to stderr
 *
 * @param {error} error Error message returned from promise.
 */
export const readError = (error, branch, type) => {
  process.stderr.write(
    chalk.bold.red('[ERR] ') +
    'Unable to ' +
    type +
    ' ' +
    chalk.yellow(branch) +
    '\n',
  );
  process.stderr.write(error.toString());

  process.exit(1);
};