const path = require('path');
const { spawn } = require('child_process');

const { buildRemotePayload, filterUniqueRemotes, readError } = require(path.resolve(
  __dirname,
  'utils',
));

/**
 * Get all remotes from git repository and return an object
 *
 * @param {String} remote Remote to list branches from
 * @return {Array} Nested Arrays to be used for each branch row.
 */
function buildListArray(remote = 'local') {
  let refsArray = [];

  const refs = getRefsArray();

  refsArray = refs.then(buildRemotePayload);

  return refsArray;
}

/**
 * @return {Array} Array of unique remotes for tab options
 */
function buildRemoteList() {
  let remoteList = [];

  const refs = getRefsArray();

  remoteList = refs.then(filterUniqueRemotes);

  return remoteList;
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
 * @param {Array} output Array containing an array of branch information
 */
function formatRemoteBranches(output) {
  let remoteBranchArray = [];

  const selectedBranch = getCurrentBranch().then(selected => {
    return selected.toString();
  });

  output.split('\n').forEach(line => {
    const currLine = line.split('/');
    const isLocal = currLine[1] === 'heads' ? true : false;

    const currRemote = isLocal ? 'local' : currLine[currLine.length - 2];
    const currBranch = currLine[currLine.length - 1];

    const selected = currBranch === selectedBranch && isLocal ? '*' : ' ';

    if (currLine[currLine.length - 1] === 'HEAD') {
      return;
    }

    remoteBranchArray.push([selected, currRemote, currBranch, line]);
  });

  return remoteBranchArray;
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