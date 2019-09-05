import chalk from 'chalk';

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
