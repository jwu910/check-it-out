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
      silent: true
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
  const args = ['fetch', '-p'];

  await execGit(args);
}

function _formatRefs(output) {
  /*
  Format output from getRemotes() and return an array of arrays containing
  formatted lines for the data table.
  */
  var retVal = [];

  output.split('\n').forEach(line => {
    const currLine = line.split('/');

    if (currLine[currLine.length - 1] === 'HEAD') {
      return;
    }

    if (currLine[1] === 'heads') {
      retVal.push(['local', currLine[currLine.length - 1]]);
    } else if (currLine[1] === 'remotes') {
      retVal.push([currLine[2], currLine[currLine.length - 1]]);
    }
  });

  return retVal;
}

async function getRemotes() {
  /*
  Function call to get list of branch refs formatted by ref name.
  */
  const args = ['for-each-ref', '--sort=refname', '--format=%(refname)'];
  const retVal = await execGit(args).then(_formatRefs);

  await fetchBranches();

  return retVal;
}

module.exports = {
  buildListArray: buildListArray,
  checkoutBranch: checkoutBranch,
  currentBranch: currentBranch
};
