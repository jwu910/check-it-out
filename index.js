const blessed = require('blessed');
const program = require('commander');
const git = require('./utils/git');

program.version('0.0.1');

program.command('test').action(() => {
  const screen = blessed.screen({
    autoPadding: true,
    debug: true,
    fullUnicode: true,
    smartCSR: true,
    title: 'Check It Out',
    warnings: true,
  });

  const currBranch = git.currentBranch();

  screen.key(['escape', 'q', 'C-c'], (ch, key) => process.exit(0));

  const table = blessed.listtable({
    align: 'left',
    border: { type: 'line' },
    height: 'shrink',
    top: 'top',
    left: 'center',
    keys: true,
    noCellBorders: true,
    style: {
      border: { fg: '#EF9B66' },
      cell: {
        selected: {
          bg: '#FFFFFF',
          fg: '#000000',
        },
      },
      header: {
        fg: '#EF9B66',
      },
      label: {
        fg: '#66D9EF',
      },
    },
    tags: true,
    top: 1,
    vi: true,
    width: '70%',
  });

  // Append our box to the screen.
  screen.append(table);

  //allow control the table with the keyboard
  table.focus();

  table.on('select', (val, key) => {
    return process.exit(0);
  });

  git.buildListArray().then(results => {
    const listData = results;
    
    table.setData(
      [
        ['Branch Name', 'Remote'],
        ...listData
      ]
    );

    screen.render();
  });
});

program.parse(process.argv);

if (program.args.length === 0) program.help();
