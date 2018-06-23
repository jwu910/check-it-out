const chalk = require('chalk');
const path = require('path');
const updateNotifier = require('update-notifier');

const {
  buildListArray,
  buildRemoteList,
  doCheckoutBranch,
  doFetchBranches,
} = require(path.resolve(__dirname, 'utils/git'));

const dialogue = require(path.resolve(__dirname, 'utils/interface'));
const { getRemoteTabs, readError } = require(path.resolve(
  __dirname,
  'utils/utils',
));

// Checks for available update and returns an instance
const pkg = require(path.resolve(__dirname, '../package.json'));
const notifier = updateNotifier({ pkg });

if (notifier.update) {
  notifier.notify();
}

export const start = args => {
  if (args[0] === '-v' || args[0] === '--version') {
    process.stdout.write(pkg.version);

    process.exit(0);
  }

  const screen = dialogue.screen();

  const branchTable = dialogue.branchTable();
  const loading = dialogue.loading();
  const helpDialogue = dialogue.helpDialogue();
  const statusBar = dialogue.statusBar();
  const statusBarText = dialogue.statusBarText();
  const statusHelpText = dialogue.statusHelpText();

  let currentRemote = 'local';
  let remoteList = [];

  const toggleHelp = () => {
    helpDialogue.toggle();
    screen.render();
  };

  /**
   * @todo: Build a keyMap utility
   * @body: Add left and right functionality to change remote. Add getUniqueRemotes method here.
   */
  screen.key('?', toggleHelp);
  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  screen.key('r', () => {
    doFetchBranches()
      .then(
        () => {
          branchTable.clearItems();

          refreshTable(currentRemote);
        },
        err => {
          screen.destroy();

          readError(err, currentRemote, 'fetch');
        },
      )
      .catch(error => {
        screen.destroy();

        readError(error, currentRemote, 'fetch');
      });
  });

  screen.append(branchTable);
  screen.append(statusBar);
  screen.append(helpDialogue);

  statusBar.append(statusBarText);
  statusBar.append(statusHelpText);

  process.on('SIGWINCH', () => {
    screen.emit('resize');
  });

  /**
   * Trim and remove whitespace from selected line.
   *
   * @param  {String} selectedLine String representation of selected line.
   * @return {Array}               Array of selected line.
   */
  const parseSelection = selectedLine => {
    const selection = selectedLine.split(/\s*\s/).map(column => {
      return column === 'local' ? '' : column;
    });

    return selection;
  };

  branchTable.on('select', selectedLine => {
    const selection = parseSelection(selectedLine.content);

    const gitBranch = selection[2];
    const gitRemote = selection[1];

    // If selection is a remote, prompt if new branch is to be created.
    return doCheckoutBranch(gitBranch, gitRemote)
      .then(output => {
        screen.destroy();

        process.stdout.write(`Checked out to ${chalk.bold(gitBranch)}\n`);

        process.exit(0);
      })
      .catch(error => {
        screen.destroy();

        readError(error, gitBranch, 'checkout');
      });
  });

  /**
   * @todo: Build a keybind utility
   */
  branchTable.key(['left', 'h'], () => {
    currentRemote = getPrevRemote(currentRemote, remoteList);
  });

  branchTable.key(['right', 'l'], () => {
    currentRemote = getNextRemote(currentRemote, remoteList);
  });

  branchTable.key('j', () => {
    branchTable.down();

    screen.render();
  });

  branchTable.key('k', () => {
    branchTable.up();

    screen.render();
  });

  branchTable.key('space', function() {
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

    screen.spawn('git', ['log', args, '--color=always']);
  });

  branchTable.focus();

  /**
   * Cycle to previous remote
   *
   * @param  currentRemote {String} Current displayed remote
   * @param  remoteList {Array} Unique remotes for current project
   * @return {String}
   */
  function getPrevRemote(currentRemote, remoteList) {
    let currIndex = remoteList.indexOf(currentRemote);

    if (currIndex > 0) {
      currIndex -= 1;
    }

    currentRemote = remoteList[currIndex];

    refreshTable(currentRemote);

    return currentRemote;
  }

  /**
   * Cycle to next remote
   *
   * @param  currentRemote {String} Current displayed remote
   * @param  remoteList {Array} Unique remotes for current project
   * @return {String}
   */
  function getNextRemote(currentRemote, remoteList) {
    let currIndex = remoteList.indexOf(currentRemote);

    if (currIndex < remoteList.length - 1) {
      currIndex += 1;
    }

    currentRemote = remoteList[currIndex];

    refreshTable(currentRemote);

    return currentRemote;
  }

  /**
   * Build array of branches for main interface
   *
   * @param {String} currentRemote Current displayed remote
   */
  function refreshTable(currentRemote = 'local') {
    buildListArray(currentRemote)
      .then(branchArray => {
        branchTable.setData([['', 'Remote', 'Branch Name'], ...branchArray]);

        screen.render();
      })
      .catch(err => {
        screen.destroy();

        process.stderr.write(chalk.red.bold('[ERROR]') + '\n');
        process.stderr.write(err + '\n');
      });

    buildRemoteList()
      .then(data => {
        remoteList = data;

        statusBarText.content = getRemoteTabs(remoteList, currentRemote);

        loading.stop();
        screen.render();
      })
      .catch(err => {
        screen.destroy();

        process.stderr.write(chalk.red.bold('[ERROR]') + '\n');
        process.stderr.write(err + '\n');
      });
  }

  screen.append(loading);
  loading.load('Loading project references.');

  refreshTable(currentRemote);
};
