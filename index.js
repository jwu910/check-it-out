#!/usr/bin/env node

const blessed = require('blessed');
const chalk = require('chalk');
const git = require('./utils/git');
const pkg = require('./package.json');
const program = require('commander');
const updateNotifier = require('update-notifier');

// Checks for available update and returns an instance
const notifier = updateNotifier({ pkg });

program.version('0.3.0', '-v, --version');

program.parse(process.argv);

const THEME_COLOR = '#FFA66D';

if (!process.argv.slice(2).length) {
  const screen = blessed.screen({
    autoPadding: true,
    fullUnicode: true,
    smartCSR: true,
    title: 'Check It Out',
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

  table.setLabel('Check it out');
  table.focus();

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
