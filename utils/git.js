const { spawn } = require('child_process');

function buildListArray(refs) {
  return getRemotes();
}

async function checkoutBranch(remote, branch) {
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

function formatRefs(output) {
  var retVal = [];

  output.split('\n').forEach(line => {
    const currLine = line.split('/');

    if (currLine[currLine.length - 1] === 'HEAD') {
      return;
    }

    if (currLine[1] === 'heads') {
      retVal.push([currLine[currLine.length - 1], 'local']);
    } else if (currLine[1] === 'remotes') {
      retVal.push([currLine[currLine.length - 1], currLine[2]]);
    }
  });

  return retVal;
}

async function getRemotes() {
  const args = ['for-each-ref', '--sort=refname', '--format=%(refname)'];

  const retVal = await execGit(args).then(formatRefs);

  return retVal;
}

module.exports = {
  buildListArray: buildListArray,
  checkoutBranch: checkoutBranch,
  currentBranch: currentBranch
};
