const { spawn } = require('child_process');
// const { split } = require('lodash');

// {
//   headers: ['col1', 'col2', 'col3'],
//   data: [
//     ['row1 data', 'row1 col2 data', 'row1 col3 data'],
//     ['row2 data', 'row2 col2 data', 'row2 col3 data']
//   ]
// }

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
      reject('Error at: ' + stderr);
    });
  });
}

function getRemotes() {
  const args = ['for-each-ref', '--sort=refname', '--format=%(refname)'];

  return execGit(args).then(formatRefs);
}

const currentBranch = () => {
  const args = ['rev-parse', '--abbrev-ref', 'HEAD'];

  return execGit(args).toString();
};

function buildListArray(refs) {
  return getRemotes();
  // return getRemotes().then((result) => {
  //   return result;
  // });
};

function formatRefs(output) {
  // console.log(output);
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
  return Promise.resolve(retVal);
}

module.exports = {
  buildListArray: buildListArray,
  currentBranch: currentBranch,
};
