const path = require('path');
const { spawn } = require('child_process');

const {
  buildRemotePayload,
  getUniqueRemotes,
  onlyUnique,
} = require(path.resolve(__dirname, 'utils'));

function buildListArray(remote = 'local') {
  // getBranches(remote); pass in remote
  return getBranchesFrom(remote);
}

/**
 * Pull branch information from selection and pass as args to execGit().
 */
async function doCheckoutBranch(branch, remote) {
  const branchPath =
    remote && remote !== 'local' ? [remote, branch].join('/') : branch;

  const args = ['checkout', branchPath];

  await execGit(args);
}

/**
 * Call git to create create branch
 *
 */
async function doCreateBranch(branch) {
  const args = ['checkout', '-b', branch];

  await execGit(args);
}

/**
 * Return name of current branch.
 */
async function getCurrentBranch() {
  const args = ['rev-parse', '--abbrev-ref', 'HEAD'];

  const retVal = await execGit(args);

  return retVal;
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
 * Call git fetch with a prune and quiet flag
 */
async function doFetchBranches() {
  const args = ['fetch', '-pq'];

  await execGit(args);
}

/**
 * Format output from getBranchesFrom() and return an array of arrays containing
 * formatted lines for the data table.
 */
async function formatRemoteBranches(output) {
  var retVal = [];

  const selectedBranch = await getCurrentBranch().then(selected => {
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

    retVal.push([selected, currRemote, currBranch, line]);
  });

  return retVal;
}

/**
 * Get an array of each remote as an array item
 * @return {Array} Array of arrays.
 */
async function getRefArray() {
  const args = ['for-each-ref', '--sort=-committerdate', '--format=%(refname)'];

  const retVal = await execGit(args);

  return retVal;
}

/**
 * Get all remotes from git repository and return an object
 * @todo: Sort return items.
 */
async function getBranchesFrom(remote) {
  const refsArray = await getRefArray()
    .then(formatRemoteBranches)
    .then(buildRemotePayload);

  return refsArray[remote];
}

module.exports = {
  buildListArray,
  doCheckoutBranch,
  doCreateBranch,
  getCurrentBranch,
  doFetchBranches,
};
