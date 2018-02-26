#!/usr/bin/env node

const blessed = require('blessed');
const chalk = require('chalk');
const git = require('./utils/git');
const pkg = require('./package.json');
const program = require('commander');
const updateNotifier = require('update-notifier');

// Checks for available update and returns an instance
const notifier = updateNotifier({ pkg });

program.version('0.2.0', '-v, --version');

program.parse(process.argv);

const THEME_COLOR = '#FFA66D';

if (!process.argv.slice(2).length) {
  const screen = blessed.screen({
    autoPadding: true,
    debug: true,
    fullUnicode: true,
    smartCSR: true,
    title: 'Check It Out',
    warnings: true
  });

  // Get name of current branch
  git.currentBranch().then(result => {
    const currBranchName = result;

    table.setLabel('Check it out -- Current Branch: ' + currBranchName);
  });

  screen.key(['escape', 'q', 'C-c'], (ch, key) => process.exit(0));

  screen.key(['r'], (ch, key) => {
    table.clearItems();

    git.fetchBranches().then(() => refreshTable());
  });

  const table = blessed.listtable({
    align: 'left',
    border: { type: 'line' },
    height: '90%',
    left: 1,
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
    width: 'shrink'
  });

  screen.append(table);

  table.focus();

  // Handle key presses
  table.on('select', async (val, key) => {
    const branchInfo = val.content
      // .split('/([a-z]|[1-9])?\w+/gi')
      .replace(' ', ',')
      .split(',')
      .map(x => {
        return x.trim() !== 'local' ? x.trim() : '';
      });

    const gitBranch = branchInfo[1];
    const gitRemote = branchInfo[0];

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
        [`Create local branch named: ${gitBranch}?`],
        ['Yes'],
        ['No']
      ]);

      screen.append(question);
      question.focus();
      screen.render();

      question.on('select', async (val, key) => {
        if (val.content.trim() === 'Yes') {
          await git
            .checkoutBranch(gitBranch, gitRemote)
            .then(git.createBranch(gitBranch))
            .then(screen.destroy());
        } else if (val.content.trim() === 'No') {
          await git.checkoutBranch(gitBranch, gitRemote).then(screen.destroy());
        }
      });
    } else {
      await git.checkoutBranch(gitBranch, gitRemote).then(screen.destroy());
    }
  });

  // Build list array
  function refreshTable() {
    git.buildListArray().then(results => {
      const listData = results;

      table.setData([['Remote', 'Branch Name'], ...listData]);

      screen.render();
    });
  }

  refreshTable();
}
