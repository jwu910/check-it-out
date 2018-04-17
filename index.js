#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const path = require('path');
const program = require('commander');
const updateNotifier = require('update-notifier');

const git = require(path.resolve(__dirname, 'utils/git'));
const dialogue = require(path.resolve(__dirname, 'utils/interface'));

// Checks for available update and returns an instance
const pkg = require(path.resolve(__dirname, 'package.json'));
const notifier = updateNotifier({ pkg });

program.version('0.3.4', '-v, --version');

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  const screen = dialogue.screen();

  const branchTable = dialogue.branchTable();
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

  statusBar.append(statusHelpText);

  process.on('SIGWINCH', () => {
    screen.emit('resize');
  });

  /**
   * @todo: Handle select -- differenciate spacebar or enter
   * @body: Set keys space, or enter to perform custom method. "select()" or "log()" or something. Select method will select, log will call git log
   */
  branchTable.on('select', async (val, key) => {
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

      if (notifier.update) {
        notifier.notify();
      }
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

  branchTable.unkey('l', 'select');

  branchTable.key(['left', 'h'], () => {
    const prevRemote = getPrevRemote(currentRemote, remoteList);

    currentRemote = prevRemote;
    refreshTable(currentRemote);
  });

  branchTable.key(['right', 'l'], () => {
    const nextRemote = getNextRemote(currentRemote, remoteList);

    currentRemote = nextRemote;
    refreshTable(currentRemote);
  });

  screen.key(['down', 'j'], () => {
    console.log('down')
    branchTable.move();
  });
  screen.key(['up', 'k'], () => {
    console.log('up')
    branchTable.move();
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
    var retVal = [currentRemote];

    var currIndex = remoteList.indexOf(currentRemote);

    if (currIndex > 0) {
      currIndex -= 1;
    }

    currentRemote = remoteList[currIndex];

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
    var retval = [currentRemote];

    var currIndex = remoteList.indexOf(currentRemote);

    if (currIndex < remoteList.length - 1) {
      currIndex += 1;
    }

    currentRemote = remoteList[currIndex];

    return currentRemote;
  }

  /**
   * Build array of branches for main interface
   *
   * @param {String} currentRemote Current displayed remote
   * @todo: buildListArray needs a variable
   * @body: Variable: [remote] optional, should be a string that matches one of the unique remotes in repo.
   */
  async function refreshTable(currentRemote) {
    // buildListArray('remote') need to add select functionality
    git.buildListArray(currentRemote).then(results => {
      branchTable.setData([['', 'Remote', 'Branch Name', 'Path'], ...results]);

      screen.render();
    });

    remoteList = await git.buildRemoteList();
  }

  refreshTable();
}
