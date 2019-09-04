import chalk from 'chalk';

/**
 * @typedef {import('../app').Ref} Ref
 * @typedef {import('../app').Remote} Remote
 */

/**
 * Function should build a separate array for each unique remote
 *
 * @param {Ref[]} refs Array containing an array of branch information
 * @return {Remote[]} Object with key-value pairs of remote-branchArray
 */
export const buildRemotePayload = refs => {
  const remotes = [];

  for (const ref of refs) {
    let remote = remotes.find(remote => remote.name === ref.remoteName);

    if (remote === undefined) {
      remote = { name: ref.remoteName, refs: [] };

      remotes.push(remote);
    }

    remote.refs.push(ref);
  }

  return remotes;
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
