const { spawn } = require('child_process');

function buildListArray(refs) {
  return getRemotes();
}

async function checkoutBranch(branch, remote) {
  const branchPath =
    remote && remote !== 'local' ? [remote, branch].join('/') : branch;

  const args = ['checkout', branchPath];

  await execGit(args);
}

async function currentBranch() {
  const args = ['rev-parse', '--abbrev-ref', 'HEAD'];

  const retVal = await execGit(args);

  return retVal;
}

function execGit(args) {
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
  const args = ['fetch', '-p'];

  await execGit(args);
}

function formatRefs(output) {
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
  const args = ['for-each-ref', '--sort=refname', '--format=%(refname)'];
  const retVal = await execGit(args).then(formatRefs);

  await fetchBranches();

  return retVal;
}

module.exports = {
  buildListArray: buildListArray,
  checkoutBranch: checkoutBranch,
  currentBranch: currentBranch
};
