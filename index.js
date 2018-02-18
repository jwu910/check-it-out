const program = require('commander');
const blessed = require('blessed');

program.version('0.0.1');

program.command('test').action(() => {
  const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    title: 'Check It Out',
  });

  screen.key(['escape', 'q', 'C-c'], (ch, key) => process.exit(0));


  // Push each git branch to item array
  const items = ['test2','test3'];

  // Create a box perfectly centered horizontally and vertically.
  const box = blessed.box({
    top: 'center',
    left: 'center',
    width: '80%',
    height: '80%',
    // Content could be another box? Maybe push each node into content to make selectable
    content: items.join('\n'),
    tags: true,
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      border: {
        fg: '#f0f0f0'
      }
    },
  });

  // Append our box to the screen.
  screen.append(box);

  // Add a png icon to the box
  // var icon = blessed.image({
  //   parent: box,
  //   top: 0,
  //   left: 0,
  //   type: 'overlay',
  //   width: 'shrink',
  //   height: 'shrink',
  //   file: __dirname + '/my-program-icon.png',
  //   search: false
  // });

  // If our box is clicked, change the content.
  // box.on('click', function(data) {
  //   box.setContent('{center}Some different {red-fg}content{/red-fg}.{/center}');
  //   screen.render();
  // });

  // // If box is focused, handle `enter`/`return` and give us some more content.
  // box.key('enter', function(ch, key) {
  //   box.setContent('{right}Even different {black-fg}content{/black-fg}.{/right}\n');
  //   box.setLine(1, 'bar');
  //   box.insertLine(1, 'foo');
  //   screen.render();
  // });

  // Focus our element.
  box.focus();

  // Render the screen.
  screen.render();

});

program.parse(process.argv);

if (program.args.length === 0) program.help();