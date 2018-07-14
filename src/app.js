const chalk = require('chalk');
const Configstore = require('configstore');
const path = require('path');
const updateNotifier = require('update-notifier');

const { doCheckoutBranch, doFetchBranches, getRefData } = require(path.resolve(
  __dirname,
  'utils/git',
));

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

const defaultConfig = {
  gitLogArguments: [
    '--color=always',
    '--pretty=format:%C(yellow)%h %Creset%s%Cblue [%cn] %Cred%d ',
  ],
  themeColor: '#FFA66D',
};

const conf = new Configstore(pkg.name, defaultConfig);

export const start = args => {
  if (args[0] === '-v' || args[0] === '--version') {
    process.stdout.write(pkg.version);
    process.exit(0);
  } else if (args[0] === '--reset-config') {
    conf.all = defaultConfig;
  }

  const gitLogArguments = conf.get('gitLogArguments');
  const screen = dialogue.screen();

  const branchTable = dialogue.branchTable();
  const loading = dialogue.loading();
  const helpDialogue = dialogue.helpDialogue();
  const statusBar = dialogue.statusBar();
  const statusBarText = dialogue.statusBarText();
  const statusHelpText = dialogue.statusHelpText();

  let branchPayload = {};
  let currentRemote = 'heads';
  let remoteList = [];

  const [branchData, remoteListTabs] = getRefData();

  screen.append(loading);
  loading.load(' Loading project references.');

  Promise.all([branchData, remoteListTabs])
    .then(data => {
      branchPayload = data[0];

      remoteList = data[1];

      refreshTable(currentRemote);
    })
    .catch(err => {
      screen.destroy();

      process.stderr.write(chalk.red.bold('[ERROR]') + '\n');
      process.stderr.write(err + '\n');

      process.exit(1);
    });

  const toggleHelp = () => {
    helpDialogue.toggle();
    screen.render();
  };

  screen.key('?', toggleHelp);
  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  screen.key('C-r', () => {
    branchTable.clearItems();

    screen.append(loading);

    loading.load(' Fetching refs.');

    doFetchBranches()
      .then(() => {
        branchTable.clearItems();

        refreshTable(currentRemote);
      })
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
      return column === 'heads' ? '' : column;
    });

    return selection;
  };

  branchTable.on('select', selectedLine => {
    const selection = parseSelection(selectedLine.content);

    const gitBranch = selection[2];
    const gitRemote = selection[1];

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

    screen.spawn('git', ['log', args, ...gitLogArguments]);
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
   * Update current screen with current remote
   *
   * @param {String} currentRemote Current displayed remote
   */
  function refreshTable(currentRemote = 'heads') {
    branchTable.setData([
      ['', 'Remote', 'Branch Name'],
      ...branchPayload[currentRemote],
    ]);

    statusBarText.content = getRemoteTabs(remoteList, currentRemote);

    loading.stop();
    screen.render();
  }
};
