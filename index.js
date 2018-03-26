#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const path = require('path');
const program = require('commander');
const updateNotifier = require('update-notifier');

const git = require(path.resolve(__dirname, 'utils/git'));
const dialogue = require(path.resolve(__dirname, 'utils/interface'));
const { THEME_COLOR } = require(path.resolve(__dirname, 'utils/theme'));

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

  const toggleHelp = () => {
    helpDialogue.toggle();
    screen.render();
  };

  screen.key('?', toggleHelp);
  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  screen.key('r', () => {
    branchTable.clearItems();

    git.fetchBranches().then(() => refreshTable());
  });

  screen.append(branchTable);
  branchTable.setLabel('Check it out');

  statusBar.append(statusHelpText);

  screen.append(statusBar);

  screen.append(helpDialogue);
  // Handle key presses
  branchTable.on('select', async (val, key) => {
    const branchInfo = val.content.split(/\s*\s/).map(column => {
      return column === 'local' ? '' : column;
    });

    const gitBranch = branchInfo[2];
    const gitRemote = branchInfo[1];

    // TODO: Identify and handle unhandledRejections
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
            .checkoutBranch(gitBranch, gitRemote)
            .then(git.createBranch(gitBranch))
            .then(screen.destroy());
        } else if (answer === 'No') {
          await git.checkoutBranch(gitBranch, gitRemote).then(screen.destroy());
        }
      });
    } else {
      await git.checkoutBranch(gitBranch, gitRemote).then(screen.destroy());
    }
  });

  branchTable.focus();

  // Build list array
  function refreshTable() {
    git.buildListArray().then(results => {
      const listData = results;

      branchTable.setData([['', 'Remote', 'Branch Name', 'Path'], ...listData]);

      screen.render();
    });
  }

  refreshTable();
}
