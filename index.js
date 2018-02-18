const blessed = require('blessed');
const contrib = require('blessed-contrib');
const program = require('commander');
const git = require('./utils/gitFunctions');

program.version('0.0.1');

program.command('test').action(() => {
  const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    title: 'Check It Out',
  });

  screen.key(['escape', 'q', 'C-c'], (ch, key) => process.exit(0));

  const table = contrib.table({
    keys: true,
    fg: 'white',
    left: 'center',
    top: 'center',
    selectedFg: 'white',
    selectedBg: 'magenta',
    interactive: true,
    label: 'Check It Out',
    width: '90%',
    height: '90%',
    border: { type: 'line', fg: 'magenta' },
    columnSpacing: 1, //in chars
    columnWidth: [80, 20, 10] /*in chars*/,
  });

  table.setData({
    headers: ['Git Sha', 'col2', 'col3'],
      // Data should be array of information. [remote, branch, date last commited, etc]
      // Each data pushed to data array
    data: [['THIS IS A TEST', 'Thello there are some words', 3], ['This is a really really long test test test tests testst', 5, 6]],
  });

  // Append our box to the screen.
  screen.append(table);

  //allow control the table with the keyboard
  table.focus();

  // Render the screen.
  screen.render();
});

program.parse(process.argv);

if (program.args.length === 0) program.help();
