#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const path = require('path');
const updateNotifier = require('update-notifier');

const {
  doCheckoutBranch,
  doFetchBranches,
  buildListArray,
  buildRemoteList,
} = require(path.resolve(__dirname, 'utils/git'));

const dialogue = require(path.resolve(__dirname, 'utils/interface'));
const { getRemoteTabs } = require(path.resolve(__dirname, 'utils/utils'));

// Checks for available update and returns an instance
const pkg = require(path.resolve('./package.json'));
const notifier = updateNotifier({ pkg });

if (notifier.update) {
  notifier.notify();
}

export const start = args => {
  if (args[0] === '-v' || args[0] === '--version') {
    process.stdout.write(pkg.version);

    process.exit(0);
  }

  const screen = dialogue.screen();

  const branchTable = dialogue.branchTable();
  const statusBarText = dialogue.statusBarText();
  const helpDialogue = dialogue.helpDialogue();
  const statusBar = dialogue.statusBar();
  const statusHelpText = dialogue.statusHelpText();

  const CHECKOUT = 'CHECKOUT';
  const CHECKED_OUT = 'CHECKED OUT';
  const CREATE = 'CREATE';
  const CREATED = 'CREATED';

  let currentRemote = 'local';
  let remoteList = [];

  const toggleHelp = () => {
    helpDialogue.toggle();
    screen.render();
  };

  /**
   * @todo: Build a keyMap utility
   * @body: Add left and right functionality to change remote. Add getUniqueRemotes method here.
   */
  screen.key('?', toggleHelp);
  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  screen.key('r', () => {
    doFetchBranches()
      .then(() => {
        branchTable.clearItems();

        refreshTable(currentRemote);
      })
      .catch(error => {
        handleError(error, currentRemote, 'fetch');
      });
  });

  screen.append(branchTable);
  screen.append(statusBar);
  screen.append(helpDialogue);

  statusBar.append(statusBarText);
  statusBar.append(statusHelpText);

  process.on('SIGWINCH', () => {
    screen.emit('resize');
  });

  /**
   * Handle errors and log to stderr
   *
   * @param {error} error Error message returned from promise.
   */
  const handleError = (error, branch, type) => {
    screen.destroy();

    process.stderr.write(
      chalk.bold.red('[ERR] ') +
        'Unable to ' +
        type +
        ' ' +
        chalk.yellow(branch) +
        '\n',
    );
    process.stderr.write(error.toString());

    process.exit(1);
  };

  /**
   * Trim and remove whitespace from selected line.
   *
   * @param  {String} selectedLine String representation of selected line.
   * @return {Array}               Array of selected line.
   */
  const parseSelection = selectedLine => {
    const selection = selectedLine.split(/\s*\s/).map(column => {
      return column === 'local' ? '' : column;
    });

    return selection;
  };

  branchTable.on('select', selectedLine => {
    const selection = parseSelection(selectedLine.content);

    const gitBranch = selection[2];
    const gitRemote = selection[1];

    // If selection is a remote, prompt if new branch is to be created.
    return doCheckoutBranch(gitBranch, gitRemote)
      .then(output => {
        screen.destroy();
      })
      .catch(error => {
        handleError(error, gitBranch, CHECKOUT);
      });
  });

  /**
   * @todo: Build a keybind utility
   */
  branchTable.key(['left', 'h'], () => {
    currentRemote = getPrevRemote(currentRemote, remoteList);
  });

  branchTable.key(['right', 'l'], () => {
    currentRemote = getNextRemote(currentRemote, remoteList);
  });

  branchTable.key('j', () => {
    branchTable.down();

    screen.render();
  });

  branchTable.key('k', () => {
    branchTable.up();

    screen.render();
  });

  branchTable.key('space', function() {
    const selection = parseSelection(this.items[this.selected].content);

    const gitBranch = selection[2];
    const gitRemote = selection[1];

    let args = [];

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
    let currIndex = remoteList.indexOf(currentRemote);

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
    let currIndex = remoteList.indexOf(currentRemote);

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
  function refreshTable(currentRemote) {
    const listArray = buildListArray(currentRemote);

    let branchArray = [];

    buildRemoteList().then(results => {
      remoteList = results;

      statusBarText.content = getRemoteTabs(remoteList, currentRemote);

      screen.render();
    });

    listArray.then(
      results => {
        branchArray = results[currentRemote];

        branchTable.setData([
          ['', 'Remote', 'Branch Name', 'Path'],
          ...branchArray,
        ]);

        screen.render();
      },
      error => {
        handleError(error, currentRemote, 'fetch');
      },
    );
  }

  refreshTable(currentRemote);
};