const { spawn } = require('child_process');
const { onlyUnique } = require('./utils');

function buildListArray(remote = 'local') {
  // getBranches(remote); pass in remote
  return getBranchesFrom(remote);
}

async function checkoutBranch(branch, remote) {
  /**
  * Pull branch information from selection and pass as args to execGit().
  */
  const branchPath =
    remote && remote !== 'local' ? [remote, branch].join('/') : branch;

  const args = ['checkout', branchPath];

  await execGit(args);
}

async function createBranch(branch) {
  /**
  * Create branch
  */
  const args = ['checkout', '-b', branch];

  await execGit(args);
}

async function currentBranch() {
  /**
  * Return name of current branch.
  */
  const args = ['rev-parse', '--abbrev-ref', 'HEAD'];

  const retVal = await execGit(args);

  return retVal;
}

function execGit(args) {
  /**
  * Execute git command with passed arguments.
  * <args> is expected to be an array of strings.
  * Example: ['fetch', '-pv']
  */
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
async function fetchBranches() {
  const args = ['fetch', '-pq'];

  await execGit(args);
}

function getUniqueRemotes(output) {
  var remoteList = [];

  output.forEach(remote => {
    remoteList.push(remote[1]);
  });

  remoteList = remoteList.filter(onlyUnique).sort();

  return remoteList
}

/**
* Function should build a separate array for each unique remote
*/
async function buildRemotePayload(output) {
  var payload = {};

  const remoteList = getUniqueRemotes(output);

  remoteList.forEach(branch => {
    payload[branch] = [];
  });

  output.forEach(remote => {
    payload[remote[1]].push(remote);
  });

  return payload;
}

/**
 * Format output from getBranchesFrom() and return an array of arrays containing
 * formatted lines for the data table.
 */
async function formatRemoteBranches_(output) {

  var retVal = [];

  const selectedBranch = await currentBranch().then(selected => {
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
    .then(formatRemoteBranches_)
    .then(buildRemotePayload);

  return refsArray[remote];
}

module.exports = {
  buildListArray,
  checkoutBranch,
  createBranch,
  currentBranch,
  fetchBranches,
};
