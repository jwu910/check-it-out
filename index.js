#!/usr/bin/env node

const blessed = require('blessed');
const chalk = require('chalk');
const git = require('./utils/git');
const program = require('commander');

program.version('0.1.2', '-v, --version');

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
  table.on('select', (val, key) => {
    const branchInfo = val.content
      // .split('/([a-z]|[1-9])?\w+/gi')
      .replace(' ', ',')
      .split(',')
      .map(x => {
        return x.trim() !== 'local' ? x.trim() : '';
      });

    const gitBranch = branchInfo[0];
    const gitRemote = branchInfo[1];

    process.on('unhandledRejection', reason => {
      console.log(chalk.yellow('[LOG] ') + reason);
    });

    git.checkoutBranch(gitRemote, gitBranch).then(screen.destroy);
    // }
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
