const chalk = require('chalk');
const Configstore = require('configstore');
const path = require('path');
const updateNotifier = require('update-notifier');

const {
  closeGitResponse,
  doCheckoutBranch,
  doFetchBranches,
  getRefData,
} = require(path.resolve(__dirname, 'utils/git'));

const dialogue = require(path.resolve(__dirname, 'utils/interface'));
const { getRemoteTabs, exitWithError, notifyMessage } = require(path.resolve(
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
  sort: '-committerdate',
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
  const loadDialogue = dialogue.loading();
  const messageCenter = dialogue.messageCenter();
  const helpDialogue = dialogue.helpDialogue();

  const statusBarContainer = dialogue.statusBarContainer();
  const statusBar = dialogue.statusBar();
  const statusBarText = dialogue.statusBarText();
  const statusHelpText = dialogue.statusHelpText();

  let branchPayload = {};
  let currentRemote = 'heads';
  let remoteList = [];

  screen.append(branchTable);
  screen.append(statusBarContainer);

  statusBar.append(statusBarText);
  statusBar.append(statusHelpText);

  statusBarContainer.append(messageCenter);
  statusBarContainer.append(statusBar);
  statusBarContainer.append(messageCenter);
  statusBarContainer.append(helpDialogue);

  screen.append(loadDialogue);

  loadDialogue.load(' Building project reference lists');

  screen.render();

  const [branchData, remoteListTabs] = getRefData();

  Promise.all([branchData, remoteListTabs])
    .then(data => {
      branchPayload = data[0];

      remoteList = data[1];

      refreshTable(currentRemote);

      notifyMessage(messageCenter, 'log', 'Loaded successfully');
    })
    .catch(err => {
      screen.destroy();

      if (err === 'SIGTERM') {
        process.stdout.write(chalk.white.bold('[INFO]') + '\n');
        process.stdout.write(
          'Checkitout closed before initial load completed \n',
        );

        process.exit(0);
      } else {
        process.stderr.write(chalk.red.bold('[ERROR]') + '\n');
        process.stderr.write(err + '\n');

        process.exit(1);
      }
    });

  const toggleHelp = () => {
    helpDialogue.toggle();
    screen.render();
  };

  screen.key('?', toggleHelp);
  screen.key(['escape', 'q', 'C-c'], () => {
    if (screen.lockKeys) {
      closeGitResponse();

      notifyMessage(messageCenter, 'log', 'Cancelled git process');
    } else {
      process.exit(0);
    }
  });
  screen.key('C-r', () => {
    branchTable.clearItems();

    loadDialogue.load(' Fetching refs...');

    notifyMessage(messageCenter, 'log', 'Fetching');

    doFetchBranches()
      .then(() => {
        branchTable.clearItems();

        refreshTable(currentRemote);
      })
      .catch(error => {
        loadDialogue.stop();

        refreshTable(currentRemote);

        notifyMessage(messageCenter, 'error', error, 5);
      });
  });

  process.on('SIGWINCH', () => {
    screen.emit('resize');

    notifyMessage(messageCenter, 'log', 'Resizing');
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

    branchTable.clearItems();

    loadDialogue.load(` Checking out ${gitBranch}...`);

    screen.render();

    return doCheckoutBranch(gitBranch, gitRemote)
      .then(output => {
        loadDialogue.stop();

        screen.destroy();

        process.stdout.write(`Checked out to ${chalk.bold(gitBranch)}\n`);

        process.exit(0);
      })
      .catch(error => {
        if (error !== 'SIGTERM') {
          screen.destroy();

          exitWithError(error, gitBranch, 'checkout');
        } else {
          refreshTable(currentRemote);

          notifyMessage(messageCenter, 'error', error);
        }
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
  const getPrevRemote = (currentRemote, remoteList) => {
    let currIndex = remoteList.indexOf(currentRemote);

    if (currIndex > 0) {
      currIndex -= 1;
    }

    currentRemote = remoteList[currIndex];

    refreshTable(currentRemote);

    return currentRemote;
  };

  /**
   * Cycle to next remote
   *
   * @param  currentRemote {String} Current displayed remote
   * @param  remoteList {Array} Unique remotes for current project
   * @return {String}
   */
  const getNextRemote = (currentRemote, remoteList) => {
    let currIndex = remoteList.indexOf(currentRemote);

    if (currIndex < remoteList.length - 1) {
      currIndex += 1;
    }

    currentRemote = remoteList[currIndex];

    refreshTable(currentRemote);

    return currentRemote;
  };

  /**
   * Update current screen with current remote
   *
   * @param {String} currentRemote Current displayed remote
   */
  const refreshTable = (currentRemote = 'heads') => {
    branchTable.setData([
      ['', 'Remote', 'Ref Name'],
      ...branchPayload[currentRemote],
    ]);

    statusBarText.content = getRemoteTabs(remoteList, currentRemote);

    loadDialogue.stop();

    screen.render();

    notifyMessage(messageCenter, 'log', 'Screen refreshed');
  };
};
