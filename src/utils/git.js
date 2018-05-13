const chalk = require('chalk');
const path = require('path');
const { spawn } = require('child_process');

const {
  buildRemotePayload,
  filterUniqueRemotes,
  readError,
} = require(path.resolve(__dirname, 'utils'));

/**
 * Get all remotes from git repository and return an object
 *
 * @param {String} remote Remote to list branches from
 * @return {Object} Return payload object containing branches associated with each local.
 */
export function buildListArray(remote = 'local') {
  const refs = getRefs();

  return refs
    .then(data => {
      return buildRemotePayload(data);
    })
    .then(payload => {
      return payload[remote];
    });
}

/**
 * @return {Array} Array of unique remotes for tab options
 */
export function buildRemoteList() {
  const refs = getRefs();

  return refs
    .then(data => {
      return filterUniqueRemotes(data);
    })
    .then(uniqueRemotes => {
      return uniqueRemotes;
    });
}

/**
 * Pull branch information from selection and pass as args to execGit().
 *
 * Returns a promise that resolves when the user has successfully checked out
 * target branch
 */
export function doCheckoutBranch(branch, remote) {
  let branchPath = '';

  if (remote && remote !== 'local' && remote !== 'origin') {
    branchPath = [remote, branch].join('/');
  } else {
    branchPath = branch;
  }

  const args = ['checkout', branchPath];

  return execGit(args);
}

/**
 * Return name of current branch.
 *
 * Returns a promise that resolves to the current branch name.
 */
export function getCurrentBranch() {
  const args = ['rev-parse', '--abbrev-ref', 'HEAD'];

  return execGit(args);
}

/**
 * Execute git command with passed arguments.
 * <args> is expected to be an array of strings.
 * Example: ['fetch', '-pv']
 */
function execGit(args) {
  return new Promise((resolve, reject) => {
    let dataString = '';
    let errorString = '';

    const gitResponse = spawn('git', args);

    gitResponse.stdout.setEncoding('utf8');
    gitResponse.stderr.setEncoding('utf8');

    gitResponse.stdout.on('data', data => (dataString += data));
    gitResponse.stderr.on('data', data => (errorString += data));

    gitResponse.on('close', code => {
      if (code === 0) {
        resolve(dataString.toString());
      } else {
        reject(errorString.toString());
      }
    });
  });
}

/**
 * Call git fetch with a prune and quiet flag.
 *
 * Return a promise that resolves when a user successfully fetches.
 */
export function doFetchBranches() {
  const args = ['fetch', '-pq'];

  return execGit(args);
}

/**
 * Format output from getBranchesFrom() and return an array of arrays containing
 * formatted lines for the data table.
 *
 * @param {String} output String list of each ref associated with repository
 * @return {Array} Array containing an array of line items representing branch information
 */
export function formatRemoteBranches(output) {
  let remoteBranchArray = [];

  return getCurrentBranch().then(selectedBranch => {
    const outputArray = output.trim().split('\n');

    outputArray.forEach(line => {
      const currLine = line.split('/');

      const currBranch = currLine[currLine.length - 1];

      const isLocal = currLine[1] === 'heads';

      const currRemote = isLocal ? 'local' : currLine[currLine.length - 2];

      const selected =
        isLocal && currBranch === selectedBranch.trim() ? '*' : ' ';

      if (currLine[currLine.length - 1] === 'HEAD') {
        return;
      }

      remoteBranchArray.push([selected, currRemote, currBranch, line]);
    });

    return remoteBranchArray;
  });
}

/**
 * Print all refs assicated with git repository.
 *
 * @return {String} String list of each ref associated with repository.
 */
function getRefs() {
  const args = ['for-each-ref', '--sort=-committerdate', '--format=%(refname)'];

  return execGit(args).then(data => {
    return formatRemoteBranches(data);
  });
}
