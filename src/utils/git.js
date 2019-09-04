const chalk = require('chalk');
const Configstore = require('configstore');
const path = require('path');
const { spawn } = require('child_process');

const pkg = require(path.resolve(__dirname, '../../package.json'));

const conf = new Configstore(pkg.name);

const { buildRemotePayload, filterUniqueRemotes } = require(path.resolve(
  __dirname,
  'utils',
));

let gitResponse;

/**
 * Kill the most recently created child process
 * Used to force exit from loading box
 */
export const closeGitResponse = () => {
  gitResponse.kill();
};

/**
 * Get references and parse through data to build branch array and remote list
 *
 * @param {String} remote Current displayed remote
 * @returns {String[]} payload and uniqueRemotes
 */
export const getRefData = async () => {
  const refs = await getRefs();

  return [buildRemotePayload(refs), filterUniqueRemotes(refs)];
};

/**
 * Pull branch information from selection and pass as args to execGit().
 *
 * Returns a promise that resolves when the user has successfully checked out
 * target branch
 */
export const doCheckoutBranch = (branch, remote) => {
  let branchPath = '';

  if (remote && remote !== 'local' && remote !== 'origin') {
    branchPath = [remote, branch].join('/');
  } else {
    branchPath = branch;
  }

  const args = ['checkout', branchPath];

  return execGit(args);
};

/**
 * Return name of current branch.
 *
 * Returns a promise that resolves to the current branch name.
 */
export const getCurrentBranch = () => {
  const args = ['rev-parse', '--abbrev-ref', 'HEAD'];

  return execGit(args);
};

/**
 * Execute git command with passed arguments.
 * <args> is expected to be an array of strings.
 * Example: ['fetch', '-pv']
 */
const execGit = args => {
  return new Promise((resolve, reject) => {
    let dataString = '';
    let errorString = '';

    gitResponse = spawn('git', args);

    gitResponse.stdout.setEncoding('utf8');
    gitResponse.stderr.setEncoding('utf8');

    gitResponse.stdout.on('data', data => (dataString += data));
    gitResponse.stderr.on('data', data => (errorString += data));

    gitResponse.on('exit', (code, signal) => {
      if (code === 0) {
        resolve(dataString.toString());
      } else if (signal === 'SIGTERM') {
        reject(signal);
      } else if (errorString.toString().includes('unknown field name')) {
        reject(
          errorString.toString() +
            'Unable to resolve git call. \n' +
            'Check custom configs at your Check It Out configuration path, or call Check It Out with the following flag to reset to default configs: ' +
            chalk.bold('--reset-config'),
        );
      } else {
        reject(errorString.toString());
      }
    });
  });
};

/**
 * Call git fetch with a prune and quiet flag.
 *
 * Return a promise that resolves when a user successfully fetches.
 */
export const doFetchBranches = () => {
  const args = ['fetch', '-pq'];

  return execGit(args);
};

/**
 * Format output from getBranchesFrom() and return an array of arrays containing
 * formatted lines for the data table.
 *
 * @param {String} output String list of each ref associated with repository
 * @return {Array} Array containing an array of line items representing branch information
 */
export const formatRemoteBranches = async output => {
  let remoteBranchArray = [];

  const selectedBranch = await getCurrentBranch();

  const outputArray = output.trim().split('\n');

  outputArray.map(line => {
    const currLine = line.split('/');

    const currBranch =
      currLine[1] === 'remotes'
        ? currLine.slice(3).join('/')
        : currLine.slice(2).join('/');

    const currRemote = currLine[1] === 'remotes' ? currLine[2] : currLine[1];

    const selected =
      currLine[1] === 'heads' && currBranch === selectedBranch.trim()
        ? '*'
        : ' ';

    if (currLine[currLine.length - 1] === 'HEAD') {
      return;
    } else if (currLine[1] === 'stash') {
      return;
    }

    remoteBranchArray.push([selected, currRemote, currBranch]);
  });

  return remoteBranchArray;
};

/**
 * Print all refs assicated with git repository.
 *
 * @return {String} String list of each ref associated with repository.
 */
const getRefs = async () => {
  const args = [
    'for-each-ref',
    `--sort=${conf.get('sort')}`,
    '--format=%(refname)',
    '--count=500',
  ];

  return formatRemoteBranches(await execGit(args));
};
