import chalk from 'chalk';

/**
 * Function should build a separate array for each unique remote
 *
 * @param {Array} output Array containing an array of branch information
 * @return {Object} Object with key-value pairs of remote-branchArray
 */
export const buildRemotePayload = output => {
  let payload = {};

  const remoteList = filterUniqueRemotes(output);

  remoteList.forEach(branch => {
    payload[branch] = [];
  });

  output.forEach(remote => {
    payload[remote[1]].push(remote);
  });

  return payload;
};

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

/**
 * Find unique remotes in repository
 *
 * @param {Array} output Array containing an array of branch information
 * @return {String[]} Array containing a unique set of remotes for this repository
 */
export const filterUniqueRemotes = output => {
  let remoteList = [];

  output.forEach(remote => remoteList.push(remote[1]));

  remoteList = remoteList.filter(onlyUnique).sort();

  return remoteList;
};

/**
 * Get "tabs" for status bar highlighting current remote
 *
 * @param {Array} remoteList - Array of unique remotes
 * @param {String} currentRemote - Name of current remote
 *
 * @return {String} Copy of remoteList with currentRemote inverted with chalk
 */
export const getRemoteTabs = (remoteList, currentRemote) => {
  const focusedIndex = remoteList.indexOf(currentRemote);

  const focusedRemoteList = remoteList.slice();

  focusedRemoteList[focusedIndex] = chalk.inverse(currentRemote);

  return focusedRemoteList.join(':');
};

/**
 * Handle errors and log to stderr - Exit application
 *
 * @param {Error} error Error message returned from promise.
 */
export const exitWithError = (error, branch, type) => {
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

/**
 * Accept message as argument, return message in status bar message logger
 *
 * @param {Object} logger The logger object.
 * @param {String} type Message type.
 * @param {String} message String to use as message.
 */

export const notifyMessage = (logger, type = 'log', message) => {
  logger.log(`[${type}] ${message}`);
};
