#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const path = require('path');
const program = require('commander');
const updateNotifier = require('update-notifier');

const git = require(path.resolve(__dirname, 'utils/git'));
const dialogue = require(path.resolve(__dirname, 'utils/interface'));
const { getRemoteTabs } = require(path.resolve(__dirname, 'utils/utils'));

// Checks for available update and returns an instance
const pkg = require(path.resolve(__dirname, 'package.json'));
const notifier = updateNotifier({ pkg });

program.version('0.6.1', '-v, --version');

program.parse(process.argv);

if (notifier.update) {
  notifier.notify();
}

if (!process.argv.slice(2).length) {
  const screen = dialogue.screen();

  const branchTable = dialogue.branchTable();
  const statusBarText = dialogue.statusBarText();
  const helpDialogue = dialogue.helpDialogue();
  const question = dialogue.question();
  const statusBar = dialogue.statusBar();
  const statusHelpText = dialogue.statusHelpText();

  const CHECKOUT = 'CHECKOUT';
  const CHECKED_OUT = 'CHECKED OUT';
  const CREATE = 'CREATE';
  const CREATED = 'CREATED';

  var currentRemote = 'local';
  var remoteList = [];

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
    git
      .doFetchBranches()
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

  const handleDetatchedHead = branch => {
    question.setData([
      ['Create local branch named: ' + chalk.white.bold(gitBranch) + '?'],
      ['Yes'],
      ['No'],
    ]);

    screen.append(question);

    screen.render();

    question.focus();

    question.on('select', val => {
      const answer = val.content.trim();

      if (answer === 'Yes') {
        git
          .doCreateBranch(branch)
          .then(({ success }) => handleSuccess(success, branch, CREATED))
          .catch(error => handleError(error, branch, CREATE));
      } else {
        handleSuccess('', branch, CREATED);
      }
    });
  };

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
    process.stderr.write(error);

    process.exit(1);
  };

  const handleSuccess = (success, branch, type) => {
    screen.destroy();

    process.stdout.write(
      chalk.bold.green('[SUCCESS] ') + type + ' ' + chalk.yellow(branch) + '\n',
    );
    process.stdout.write(success);

    process.exit(0);
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
    git
      .doCheckoutBranch(gitBranch, gitRemote)
      .then(({ success }) => {
        if (gitRemote) {
          handleDetatchedHead(gitBranch);
        } else {
          handleSuccess(success, branch, CHECKED_OUT);
        }

        process.exit(0);
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
  function refreshTable(currentRemote) {
    const listArray = git.buildListArray(currentRemote);

    var branchArray = [];

    git.buildRemoteList().then(results => {
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
}
