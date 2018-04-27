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
  const branchPath =
    remote && remote !== 'local' ? [remote, branch].join('/') : branch;

  const args = ['checkout', branchPath];

  return execGit(args);
}

/**
 * Call git to create create branch
 *
 * Returns a promise that resolves when a branch is successfully created.
 */
function doCreateBranch(branch) {
  const args = ['checkout', '-b', branch];

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
    const gitResponse = spawn('git', args, {
      cwd: process.cwd(),
      silent: true,
    });

    var retVal = '';

    gitResponse.stdout.on('data', data => {
      retVal += data.toString();
    });

    gitResponse.stdout.on('close', () => {
      resolve(retVal.trim());
    });

    gitResponse.stderr.on('data', stderr => {
      reject(stderr.toString());
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
  doCreateBranch,
  getCurrentBranch,
  doFetchBranches,
};
