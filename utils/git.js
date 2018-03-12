const { spawn } = require('child_process');

function buildListArray(refs) {
  return getRemotes();
}

async function checkoutBranch(branch, remote) {
  /*
  Pull branch information from selection and pass as args to execGit().
  */
  const branchPath =
    remote && remote !== 'local' ? [remote, branch].join('/') : branch;

  const args = ['checkout', branchPath];

  await execGit(args);
}

async function createBranch(branch) {
  /*
  Create branch
  */
  const args = ['checkout', '-b', branch];

  await execGit(args);
}

async function currentBranch() {
  /*
  Return name of current branch.
  */
  const args = ['rev-parse', '--abbrev-ref', 'HEAD'];

  const retVal = await execGit(args);

  return retVal;
}

function execGit(args) {
  /*
  Execute git command with passed arguments.
  <args> is expected to be an array of strings.
  Example: ['fetch', '-pv']
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

async function fetchBranches() {
  /*
  Fetch and prune.
  */
  const args = ['fetch', '-pq'];

  await execGit(args);
}

async function _formatRefs(output) {
  /*
  Format output from getRemotes() and return an array of arrays containing
  formatted lines for the data table.
  */
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

async function getRemotes() {
  /*
  Function call to get list of branch refs formatted by ref name.
  */
  const args = ['for-each-ref', '--sort=refname', '--format=%(refname)'];
  const retVal = await execGit(args).then(_formatRefs);

  return retVal;
}

module.exports = {
  buildListArray: buildListArray,
  checkoutBranch: checkoutBranch,
  createBranch: createBranch,
  currentBranch: currentBranch,
  fetchBranches: fetchBranches,
};
