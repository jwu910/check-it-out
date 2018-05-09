'use strict';

var path = require('path');

var _require = require('child_process'),
    spawn = _require.spawn;

var _require2 = require(path.resolve(__dirname, 'utils')),
    buildRemotePayload = _require2.buildRemotePayload,
    filterUniqueRemotes = _require2.filterUniqueRemotes;

/**
 * Get all remotes from git repository and return an object
 *
 * @param {String} remote Remote to list branches from
 */


function buildListArray() {
  var remote = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'local';

  var refsArray = [];

  var refs = getRefs();

  refsArray = refs.then(formatRemoteBranches).then(buildRemotePayload);

  return refsArray;
}

/**
 * @return {Array} Array of unique remotes for tab options
 */
function buildRemoteList() {
  var remoteList = [];

  var refs = getRefs();

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

  var args = ['checkout', branchPath];

  return execGit(args);
}

/**
 * Return name of current branch.
 *
 * Returns a promise that resolves to the current branch name.
 */
function getCurrentBranch() {
  var args = ['rev-parse', '--abbrev-ref', 'HEAD'];

  return execGit(args);
}

/**
 * Execute git command with passed arguments.
 * <args> is expected to be an array of strings.
 * Example: ['fetch', '-pv']
 */
function execGit(args) {
  return new Promise(function (resolve, reject) {
    var dataString = '';
    var errorString = '';

    var gitResponse = spawn('git', args);

    gitResponse.stdout.setEncoding('utf8');
    gitResponse.stderr.setEncoding('utf8');

    gitResponse.stdout.on('data', function (data) {
      return dataString += data;
    });
    gitResponse.stderr.on('data', function (data) {
      return errorString += data;
    });

    gitResponse.on('close', function (code) {
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
function doFetchBranches() {
  var args = ['fetch', '-pq'];

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

  var selectedBranch = getCurrentBranch().then(function (selected) {
    return selected.toString();
  });

  output.split('\n').forEach(function (line) {
    var currLine = line.split('/');
    var isLocal = currLine[1] === 'heads' ? true : false;

    var currRemote = isLocal ? 'local' : currLine[currLine.length - 2];
    var currBranch = currLine[currLine.length - 1];

    var selected = currBranch === selectedBranch && isLocal ? '*' : ' ';

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
  var args = ['for-each-ref', '--sort=-committerdate', '--format=%(refname)'];

  return execGit(args);
}

module.exports = {
  buildListArray: buildListArray,
  buildRemoteList: buildRemoteList,
  doCheckoutBranch: doCheckoutBranch,
  getCurrentBranch: getCurrentBranch,
  doFetchBranches: doFetchBranches
};