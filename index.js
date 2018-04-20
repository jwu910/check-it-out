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

program.version('0.4.0', '-v, --version');

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
    branchTable.clearItems();

    git.doFetchBranches().then(() => refreshTable(currentRemote));
  });

  screen.append(branchTable);
  screen.append(statusBar);
  screen.append(helpDialogue);

  statusBar.append(statusBarText)
  statusBar.append(statusHelpText);

  process.on('SIGWINCH', () => {
    screen.emit('resize');
  });

  /**
   * @todo: Handle select -- differenciate spacebar or enter
   * @body: Set keys space, or enter to perform custom method. "select()" or "log()" or something. Select method will select, log will call git log
   */
  branchTable.on('select', async val => {
    const branchInfo = val.content.split(/\s*\s/).map(column => {
      return column === 'local' ? '' : column;
    });

    const gitBranch = branchInfo[2];
    const gitRemote = branchInfo[1];

    /**
     * @todo: Identify and handle unhandledRejections
     * @body: Some errors are not handled and the following rejection is passed is the workaround
     */
    process.on('unhandledRejection', reason => {
      console.log(chalk.yellow('[LOG] ') + reason);
    });

    // If selection is a remote, prompt if new branch is to be created.
    if (gitRemote !== '') {
      question.setData([
        [
          'Create local branch named: ' +
            chalk.white.bold(`${gitBranch}`) +
            '?',
        ],
        ['Yes'],
        ['No'],
      ]);

      screen.append(question);
      question.focus();
      screen.render();

      question.on('select', async (val, key) => {
        const answer = val.content.trim();

        if (answer === 'Yes') {
          await git
            .doCheckoutBranch(gitBranch, gitRemote)
            .then(git.doCreateBranch(gitBranch))
            .then(screen.destroy());
        } else if (answer === 'No') {
          await git
            .doCheckoutBranch(gitBranch, gitRemote)
            .then(screen.destroy());
        }
      });
    } else {
      await git.doCheckoutBranch(gitBranch, gitRemote).then(screen.destroy());
    }
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
  async function refreshTable(currentRemote) {
    const results = await git.buildListArray(currentRemote);

    branchTable.setData([['', 'Remote', 'Branch Name', 'Path'], ...results]);

    remoteList = await git.buildRemoteList();

    statusBarText.content = getRemoteTabs(remoteList, currentRemote);

    screen.render();
  }

  refreshTable(currentRemote);
}
