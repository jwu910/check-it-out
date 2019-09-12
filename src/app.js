import chalk from 'chalk';
import Configstore from 'configstore';
import path from 'path';
import stripAnsi from 'strip-ansi';
import updateNotifier from 'update-notifier';

import {
  closeGitResponse,
  doCheckoutBranch,
  doFetchBranches,
  getRefData,
} from './utils/git';

import * as dialogue from './utils/interface';

/**
 * @typedef {{active: boolean, id: number, name: string, remoteName: string}} Ref
 * @typedef {{name: string, refs: Ref[]}} Remote
 *
 * @typedef {object} State
 * @property {number} currentRemoteIndex
 * @property {string} filter
 * @property {Remote[]} remotes
 * @property {string} search
 * @property {() => Remote} getCurrentRemote
 * @property {() => RegExp} getFilterRegex
 * @property {() => RegExp} getSearchRegex
 * @property {() => number[]} getSearchHits
 */

// Checks for available update and returns an instance
const pkg = require(path.resolve(__dirname, '../package.json'));
const notifier = updateNotifier({ pkg });

if (notifier.update) {
  const notifierMessage = `\
  New ${chalk.yellow(notifier.update.type)} version of ${
    notifier.update.name
  } available ${chalk.red(notifier.update.current)} ➜  ${chalk.green(
    notifier.update.latest,
  )}\
  \n${chalk.yellow('Changelog:')} ${chalk.blue(
    `https://github.com/jwu910/check-it-out/releases/tag/v${
      notifier.update.latest
    }`,
  )}\
  \nRun ${chalk.green('npm i -g check-it-out')} to update!`;

  notifier.notify({ message: notifierMessage });
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

export const start = async args => {
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

  /** @type {State} */
  const state = {
    currentRemoteIndex: 0,
    filter: '',
    getCurrentRemote() {
      return this.remotes[this.currentRemoteIndex];
    },
    getFilterRegex() {
      return new RegExp(this.filter, 'gi');
    },
    getSearchRegex() {
      return new RegExp(this.search, 'gi');
    },
    getSearchHits() {
      if (!this.search) {
        return [];
      }

      const remote = this.getCurrentRemote();

      return remote.refs
        .filter(ref => ref.name.search(this.getFilterRegex()) !== -1)
        .map((ref, index) => {
          if (ref.name.search(this.getSearchRegex()) !== -1) {
            return index + 1;
          }

          return NaN;
        })
        .filter(index => !isNaN(index));
    },
    search: '',
    remotes: [],
  };

  const getLogger = prefix => message => {
    messageCenter.log(`[${prefix}] ${message}`);
  };

  const logMessage = getLogger('log');
  const logError = getLogger('error');

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

  const toggleHelp = () => {
    helpDialogue.toggle();
    screen.render();
  };

  screen.key('?', toggleHelp);
  screen.key(['escape', 'q', 'C-c'], () => {
    if (screen.lockKeys) {
      closeGitResponse();

      logMessage('Cancelled git process');
    } else {
      process.exit(0);
    }
  });
  screen.key('C-r', async () => {
    branchTable.clearItems();

    loadDialogue.load(' Fetching refs...');

    logMessage('Fetching');

    try {
      await doFetchBranches();

      branchTable.clearItems();

      refreshTable();
    } catch (error) {
      loadDialogue.stop();

      refreshTable();

      logError(error);
    }
  });

  function getPrompt(label, cb) {
    const input = dialogue.input(label, '', cb);

    screen.append(input);

    input.show();
    input.focus();

    screen.render();
  }

  screen.key('&', () => {
    getPrompt('Filter term:', value => {
      state.filter = value;

      logMessage(`Filtering by term: ${value}`);

      refreshTable();
    });
  });

  screen.key('/', () => {
    getPrompt('Search term:', value => {
      state.search = value;

      logMessage(`Searching by term: ${value}`);

      refreshTable();
    });
  });

  process.on('SIGWINCH', () => {
    screen.emit('resize');

    logMessage('Resizing');
  });

  /**
   * Trim and remove whitespace from selected line.
   *
   * @param  {String} selectedLine String representation of selected line.
   * @return {Array}               Array of selected line.
   */
  const parseSelection = selectedLine => {
    const selection = stripAnsi(selectedLine)
      .split(/\s*\s/)
      .map(column => {
        return column === 'heads' ? '' : column;
      });

    return selection;
  };

  branchTable.on('select', async selectedLine => {
    const selection = parseSelection(selectedLine.content);

    const gitBranch = selection[2];
    const gitRemote = selection[1];

    branchTable.clearItems();

    loadDialogue.load(` Checking out ${gitBranch}...`);

    screen.render();

    try {
      await doCheckoutBranch(gitBranch, gitRemote);

      loadDialogue.stop();

      screen.destroy();

      process.stdout.write(`Checked out to ${chalk.bold(gitBranch)}\n`);

      process.exit(0);
    } catch (error) {
      if (error !== 'SIGTERM') {
        screen.destroy();

        process.stderr.write(
          chalk.bold.red('[ERR] ') +
            'Unable to checkout ' +
            chalk.yellow(gitBranch) +
            '\n' +
            error.toString(),
        );

        process.exit(1);
      } else {
        refreshTable();

        logError(error);
      }
    }
  });

  branchTable.key(['left', 'h'], () => {
    state.currentRemoteIndex = Math.max(state.currentRemoteIndex - 1, 0);

    refreshTable();
  });

  branchTable.key(['right', 'l'], () => {
    state.currentRemoteIndex = Math.min(
      state.currentRemoteIndex + 1,
      state.remotes.length - 1,
    );

    refreshTable();
  });

  branchTable.key('j', () => {
    branchTable.down(1);

    screen.render();
  });

  branchTable.key('k', () => {
    branchTable.up(1);

    screen.render();
  });

  branchTable.key('n', () => {
    // @ts-ignore
    const currentRefIndex = branchTable.selected;
    const searchHits = state.getSearchHits();

    const filteredHits = searchHits.filter(n => n > currentRefIndex);

    if (filteredHits.length) {
      branchTable.select(filteredHits[0]);
      screen.render();
    }
  });

  branchTable.key('S-n', () => {
    // @ts-ignore
    const currentRefIndex = branchTable.selected;
    const searchHits = state.getSearchHits();

    const filteredHits = searchHits.filter(n => n < currentRefIndex);

    if (filteredHits.length) {
      branchTable.select(filteredHits[filteredHits.length - 1]);
      screen.render();
    }
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

    screen.spawn('git', ['log', args.join('/'), ...gitLogArguments]);
  });

  branchTable.focus();

  /**
   * Update current screen with current remote
   */
  const refreshTable = () => {
    const remote = state.getCurrentRemote();

    const tableData = remote.refs
      .filter(ref => ref.name.search(state.getFilterRegex()) !== -1)
      .map(ref => [
        ref.active ? '*' : ' ',
        ref.remoteName,
        ref.name.replace(state.getSearchRegex(), match => chalk.inverse(match)),
      ]);

    branchTable.setData([['', 'Remote', 'Ref Name'], ...tableData]);

    const tabNames = state.remotes.map((remote, index) => {
      let name = remote.name;

      if (index === state.currentRemoteIndex) {
        name = chalk.inverse(name);
      }

      return name;
    });

    statusBarText.content = tabNames.join(':');

    loadDialogue.stop();

    screen.render();

    logMessage('Screen refreshed');
  };

  try {
    state.remotes = await getRefData();

    state.currentRemoteIndex = state.remotes.findIndex(
      remote => remote.name === 'heads',
    );

    refreshTable();

    logMessage('Loaded successfully');
  } catch (err) {
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
  }
};
