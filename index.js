#!/usr/bin/env node

const blessed = require('blessed');
const program = require('commander');
const git = require('./utils/git');

program.version('0.1.1', '-v, --version');

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  const screen = blessed.screen({
    autoPadding: true,
    debug: true,
    fullUnicode: true,
    smartCSR: true,
    title: 'Check It Out',
    warnings: true,
  });

  // Get name of current branch
  git.currentBranch().then(result => {
    const currBranchName = result;

    table.setLabel('Check it out -- Current Branch: ' + currBranchName);
  });

  screen.key(['escape', 'q', 'C-c'], (ch, key) => process.exit(0));

  const table = blessed.listtable({
    align: 'left',
    border: { type: 'line' },
    height: '90%',
    top: 'top',
    left: 'center',
    keys: true,
    noCellBorders: true,
    style: {
      border: { fg: '#EF9B66' },
      cell: {
        selected: {
          bg: '#FFFFFF',
          fg: '#272727',
        },
      },
      header: {
        fg: '#EF9B66',
      },
      label: {
        fg: '#FFFFFF',
      },
    },
    tags: true,
    top: 1,
    vi: true,
    width: 'shrink',
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

    git.checkoutBranch(gitRemote, gitBranch).then(screen.destroy());
  });

  // Build list array
  git.buildListArray().then(results => {
    const listData = results;

    table.setData([['Branch Name', 'Remote'], ...listData]);

    screen.render();
  });
}
