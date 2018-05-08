const path = require('path');
const { spawn } = require('child_process');

const { buildRemotePayload, filterUniqueRemotes } = require(path.resolve(
  __dirname,
  'utils',
));

/**
 * Get all remotes from git repository and return an object
 *
 * @param {String} remote Remote to list branches from
 */
function buildListArray(remote = 'local') {
  var refsArray = [];

  const refs = getRefs();

  refsArray = refs.then(formatRemoteBranches).then(buildRemotePayload);

  return refsArray;
}

/**
 * @return {Array} Array of unique remotes for tab options
 */
function buildRemoteList() {
  var remoteList = [];

  const refs = getRefs();

  remoteList = refs.then(formatRemoteBranches).then(filterUniqueRemotes);

  return remoteList;
}

/**
 * Pull branch information from selection and pass as args to execGit().
 *
 * Returns a promise that resolves when the user has successfully checked out
 * target branch
 */
function doCheckoutBranch(branch, remote) {
  var branchPath = '';

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
function getCurrentBranch() {
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

    const gitResponse = spawn('git', args, {
      cwd: process.cwd(),
      silent: true,
    });

    gitResponse.stdout.setEncoding('utf8');
    gitResponse.stderr.setEncoding('utf8');

    gitResponse.stdout.on('data', (data) => dataString += data);
    gitResponse.stderr.on('data', (data) => errorString += data);

    gitResponse.on('close', (code) => {
      if (code === 0) {
        resolve(dataString.trim());
      } else {
        reject(errorString.trim());
      }
    });
  });
}

/**
 * Call git fetch with a prune and quiet flag.
 *
 * Return a promise that resolves when a user successfully fetches.
 */
function doFetchBranches() {
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
  var remoteBranchArray = [];

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
 * Get an array of each remote as an array item
 *
 * @return {Array} Array of arrays.
 */
function getRefs() {
  const args = ['for-each-ref', '--sort=-committerdate', '--format=%(refname)'];

  return execGit(args);
}

module.exports = {
  buildListArray,
  buildRemoteList,
  doCheckoutBranch,
  getCurrentBranch,
  doFetchBranches,
};
