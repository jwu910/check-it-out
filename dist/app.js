'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var chalk = require('chalk');
var path = require('path');
var updateNotifier = require('update-notifier');

var _require = require(path.resolve(__dirname, 'utils/git')),
    buildListArray = _require.buildListArray,
    buildRemoteList = _require.buildRemoteList,
    doCheckoutBranch = _require.doCheckoutBranch,
    doFetchBranches = _require.doFetchBranches;

var dialogue = require(path.resolve(__dirname, 'utils/interface'));

var _require2 = require(path.resolve(__dirname, 'utils/utils')),
    getRemoteTabs = _require2.getRemoteTabs,
    readError = _require2.readError;

// Checks for available update and returns an instance


var pkg = require(path.resolve(__dirname, '../package.json'));
var notifier = updateNotifier({ pkg });

if (notifier.update) {
  notifier.notify();
}

var start = exports.start = function start(args) {
  if (args[0] === '-v' || args[0] === '--version') {
    process.stdout.write(pkg.version);

    process.exit(0);
  }

  var screen = dialogue.screen();

  var branchTable = dialogue.branchTable();
  var loading = dialogue.loading();
  var helpDialogue = dialogue.helpDialogue();
  var statusBar = dialogue.statusBar();
  var statusBarText = dialogue.statusBarText();
  var statusHelpText = dialogue.statusHelpText();

  var currentRemote = 'local';
  var remoteList = [];

  var toggleHelp = function toggleHelp() {
    helpDialogue.toggle();
    screen.render();
  };

  /**
   * @todo: Build a keyMap utility
   * @body: Add left and right functionality to change remote. Add getUniqueRemotes method here.
   */
  screen.key('?', toggleHelp);
  screen.key(['escape', 'q', 'C-c'], function () {
    return process.exit(0);
  });
  screen.key('r', function () {
    doFetchBranches().then(function () {
      branchTable.clearItems();

      refreshTable(currentRemote);
    }, function (err) {
      screen.destroy();

      readError(err, currentRemote, 'fetch');
    }).catch(function (error) {
      screen.destroy();

      readError(error, currentRemote, 'fetch');
    });
  });

  screen.append(branchTable);
  screen.append(statusBar);
  screen.append(helpDialogue);

  statusBar.append(statusBarText);
  statusBar.append(statusHelpText);

  process.on('SIGWINCH', function () {
    screen.emit('resize');
  });

  /**
   * Trim and remove whitespace from selected line.
   *
   * @param  {String} selectedLine String representation of selected line.
   * @return {Array}               Array of selected line.
   */
  var parseSelection = function parseSelection(selectedLine) {
    var selection = selectedLine.split(/\s*\s/).map(function (column) {
      return column === 'local' ? '' : column;
    });

    return selection;
  };

  branchTable.on('select', function (selectedLine) {
    var selection = parseSelection(selectedLine.content);

    var gitBranch = selection[2];
    var gitRemote = selection[1];

    // If selection is a remote, prompt if new branch is to be created.
    return doCheckoutBranch(gitBranch, gitRemote).then(function (output) {
      screen.destroy();

      process.stdout.write(`Checked out to ${chalk.bold(gitBranch)}\n`);

      process.exit(0);
    }).catch(function (error) {
      screen.destroy();

      readError(error, gitBranch, 'checkout');
    });
  });

  /**
   * @todo: Build a keybind utility
   */
  branchTable.key(['left', 'h'], function () {
    currentRemote = getPrevRemote(currentRemote, remoteList);
  });

  branchTable.key(['right', 'l'], function () {
    currentRemote = getNextRemote(currentRemote, remoteList);
  });

  branchTable.key('j', function () {
    branchTable.down();

    screen.render();
  });

  branchTable.key('k', function () {
    branchTable.up();

    screen.render();
  });

  branchTable.key('space', function () {
    var selection = parseSelection(this.items[this.selected].content);

    var gitBranch = selection[2];
    var gitRemote = selection[1];

    var args = [];

    if (gitRemote) {
      args.push(gitRemote);
    }

    args.push(gitBranch);

    if (args.length > 1) {
      args = args.join('/');
    }

    screen.spawn('git', ['log', args, '--color=always']);
  });

  branchTable.focus();

  /**
   * Cycle to previous remote
   *
   * @param  currentRemote {String} Current displayed remote
   * @param  remoteList {Array} Unique remotes for current project
   * @return {String}
   */
  function getPrevRemote(currentRemote, remoteList) {
    var currIndex = remoteList.indexOf(currentRemote);

    if (currIndex > 0) {
      currIndex -= 1;
    }

    currentRemote = remoteList[currIndex];

    refreshTable(currentRemote);

    return currentRemote;
  }

  /**
   * Cycle to next remote
   *
   * @param  currentRemote {String} Current displayed remote
   * @param  remoteList {Array} Unique remotes for current project
   * @return {String}
   */
  function getNextRemote(currentRemote, remoteList) {
    var currIndex = remoteList.indexOf(currentRemote);

    if (currIndex < remoteList.length - 1) {
      currIndex += 1;
    }

    currentRemote = remoteList[currIndex];

    refreshTable(currentRemote);

    return currentRemote;
  }

  /**
   * Build array of branches for main interface
   *
   * @param {String} currentRemote Current displayed remote
   */
  function refreshTable() {
    var currentRemote = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'local';

    buildListArray(currentRemote).then(function (branchArray) {
      branchTable.setData([['', 'Remote', 'Branch Name']].concat(_toConsumableArray(branchArray)));

      screen.render();
    }).catch(function (err) {
      screen.destroy();

      process.stderr.write(chalk.red.bold('[ERROR]') + '\n');
      process.stderr.write(err + '\n');
    });

    buildRemoteList().then(function (data) {
      remoteList = data;

      statusBarText.content = getRemoteTabs(remoteList, currentRemote);

      loading.stop();
      screen.render();
    }).catch(function (err) {
      screen.destroy();

      process.stderr.write(chalk.red.bold('[ERROR]') + '\n');
      process.stderr.write(err + '\n');
    });
  }

  screen.append(loading);
  loading.load('Loading project references.');

  refreshTable(currentRemote);
};