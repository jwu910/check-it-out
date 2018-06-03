export const refsListTable() {
  const refsListTable = blessed.listtable({
    align: 'left',
    left: 0,
    keys: true,
    noCellBorders: true,
    scrollable: true,
    scrollbar: true,
    style: {
      cell: {
        selected: {
          bg: '#FFFFFF',
          fg: '#272727',
        },
      },
      header: {
        fg: THEME_COLOR,
      },
      label: {
        fg: '#FFFFFF',
      },
      scrollbar: {
        bg: THEME_COLOR,
      },
    },
    tags: true,
    top: 0,
    bottom: 1,
    vi: false,
    width: 'shrink',
  });

  refsListTable.key(['left', 'h'], () => {
    currentRemote = getPrevRemote(currentRemote, remoteList);
  });

  refsListTable.key(['right', 'l'], () => {
    currentRemote = getNextRemote(currentRemote, remoteList);
  });

  refsListTable.key('j', () => {
    refsListTable.down();

    refsListTable.screen.render();
  });

  refsListTable.key('k', () => {
    refsListTable.up();

    refsListTable.screen.render();
  });

  refsListTable.key('space', function() {
    const selection = parseSelection(this.items[this.selected].content);

    const gitBranch = selection[2];
    const gitRemote = selection[1];

    let args = [];

    if (gitRemote) {
      args.push(gitRemote);
    }

    args.push(gitBranch);

    if (args.length > 1) {
      args = args.join('/');
    }

    refsListTable.screen.spawn('git', ['log', args, '--color=always']);
  });

  refsListTable.on('select', selectedLine => {
    const selection = parseSelection(selectedLine.content);

    const gitBranch = selection[2];
    const gitRemote = selection[1];


    store.dispatch(checkoutRef(`${gitRemote}/${gitBranch}`))
    // dispatch action to chekout branchcheckoutRef
  });

  return refsListTable;
}

const parseSelection = selectedLine => {
  const selection = selectedLine.split(/\s*\s/).map(column => {
    return column === 'local' ? '' : column;
  });

  return selection;
};
