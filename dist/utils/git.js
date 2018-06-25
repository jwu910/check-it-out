'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildListArray = buildListArray;
exports.buildRemoteList = buildRemoteList;
exports.doCheckoutBranch = doCheckoutBranch;
exports.getCurrentBranch = getCurrentBranch;
exports.doFetchBranches = doFetchBranches;
exports.formatRemoteBranches = formatRemoteBranches;
var chalk = require('chalk');
var path = require('path');

var _require = require('child_process'),
    spawn = _require.spawn;

var _require2 = require(path.resolve(__dirname, 'utils')),
    buildRemotePayload = _require2.buildRemotePayload,
    filterUniqueRemotes = _require2.filterUniqueRemotes,
    readError = _require2.readError;

/**
 * Get all remotes from git repository and return an object
 *
 * @param {String} remote Remote to list branches from
 * @return {Object} Return payload object containing branches associated with each local.
 */


function buildListArray() {
  var remote = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'local';

  var refs = getRefs();

  return refs.then(function (data) {
    return buildRemotePayload(data);
  }).then(function (payload) {
    return payload[remote];
  });
}

/**
 * @return {Array} Array of unique remotes for tab options
 */
function buildRemoteList() {
  var refs = getRefs();

  return refs.then(function (data) {
    return filterUniqueRemotes(data);
  }).then(function (uniqueRemotes) {
    return uniqueRemotes;
  });
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
 * @param {String} output String list of each ref associated with repository
 * @return {Array} Array containing an array of line items representing branch information
 */
function formatRemoteBranches(output) {
  var remoteBranchArray = [];

  return getCurrentBranch().then(function (selectedBranch) {
    var outputArray = output.trim().split('\n');

    outputArray.forEach(function (line) {
      var currLine = line.split('/');

      var currBranch = currLine[currLine.length - 1];

      var isLocal = currLine[1] === 'heads';

      var currRemote = isLocal ? 'local' : currLine[currLine.length - 2];

      var selected = isLocal && currBranch === selectedBranch.trim() ? '*' : ' ';

      if (currLine[currLine.length - 1] === 'HEAD') {
        return;
      }

      remoteBranchArray.push([selected, currRemote, currBranch]);
    });

    return remoteBranchArray;
  });
}

/**
 * Print all refs assicated with git repository.
 *
 * @return {String} String list of each ref associated with repository.
 */
function getRefs() {
  var args = ['for-each-ref', '--sort=-committerdate', '--format=%(refname)', '--count=500'];

  return execGit(args).then(function (data) {
    return formatRemoteBranches(data);
  });
}