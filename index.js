#!/usr/bin/env node

'use strict';

const blessed = require('blessed');
const chalk = require('chalk');
const git = require('./utils/git');
const pkg = require('./package.json');
const program = require('commander');
const updateNotifier = require('update-notifier');
const help = require('./utils/helpText');

// Checks for available update and returns an instance
const notifier = updateNotifier({ pkg });

program.version('0.3.1', '-v, --version');

program.parse(process.argv);

const THEME_COLOR = '#FFA66D';

if (!process.argv.slice(2).length) {
  const screen = blessed.screen({
    autoPadding: true,
    fullUnicode: true,
    smartCSR: true,
    title: 'Check It Out',
  });

  const toggleHelp = () => {
    helpDialogue.toggle();
    screen.render();
  };

  screen.key('?', toggleHelp);
  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  screen.key('r', () => {
    table.clearItems();

    git.fetchBranches().then(() => refreshTable());
  });

  const table = blessed.listtable({
    align: 'left',
    border: { type: 'line' },
    height: '90%',
    left: 0,
    keys: true,
    noCellBorders: true,
    scrollbar: true,
    style: {
      border: { fg: THEME_COLOR },
      cell: {
        selected: {
          bg: '#FFFFFF',
          fg: '#272727'
        }
      },
      header: {
        fg: THEME_COLOR
      },
      label: {
        fg: '#FFFFFF'
      },
      scrollbar: {
        bg: THEME_COLOR
      }
    },
    tags: true,
    top: 1,
    vi: true,
    width: '100%'
  });

  screen.append(table);
  table.setLabel('Check it out');

  const statusBar = blessed.box({
    border: { type: 'line' },
    bottom: 0,
    height: 3,
    right: 0,
    style: {
      border: { fg: THEME_COLOR },
    },
    shrink: true,
    width: 'shrink',
  });

  const statusHelpText = blessed.text({
    content: 'Press "?" to show/hide help.',
    right: 0,
  });

  const helpDialogue = blessed.table({
    align: 'left',
    border: { type: 'line' },
    data: help.helpText(),
    height: 'shrink',
    hidden: true,
    noCellBorders: true,
    right: 0,
    style: {
      border: { fg: THEME_COLOR },
    },
    bottom: 0,
    width: 'shrink',
  });

  statusBar.append(statusHelpText);

  screen.append(statusBar);

  screen.append(helpDialogue);
  // Handle key presses
  table.on('select', async (val, key) => {
    const branchInfo = val.content
      .split(/\s*\s/)
      .map(column => {
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

    // If selection is a remote prompt if new branch is to be created.
    if (gitRemote !== '') {
      const question = blessed.listtable({
        align: 'left',
        border: { type: 'line' },
        height: '20%',
        keys: true,
        left: 2,
        style: {
          border: { fg: THEME_COLOR },
          cell: {
            selected: {
              bg: '#FFFFFF',
              fg: '#272727'
            }
          },
          header: {
            fg: THEME_COLOR
          },
          label: {
            fg: '#FFFFFF'
          },
          scrollbar: {
            bg: THEME_COLOR
          }
        },
        tags: true,
        top: '30%',
        vi: true,
        width: 'shrink'
      });

      question.setData([
        ['Create local branch named: ' + chalk.white.bold(`${gitBranch}`) + '?'],
        ['Yes'],
        ['No']
      ]);

      screen.append(question);
      question.focus();
      screen.render();

      question.on('select', async (val, key) => {
        const answer = val.content.trim()

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

  table.focus();

  // Build list array
  function refreshTable() {
    git.buildListArray().then(results => {
      const listData = results;

      table.setData([['', 'Remote', 'Branch Name', 'Path'], ...listData]);

      screen.render();
    });
  }

  refreshTable();
}
