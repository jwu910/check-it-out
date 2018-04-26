#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const path = require('path');
const program = require('commander');
const updateNotifier = require('update-notifier');

const git = require(path.resolve(__dirname, 'utils/git'));
const dialogue = require(path.resolve(__dirname, 'utils/interface'));
const { getRemoteTabs } = require(path.resolve(__dirname, 'utils/utils'));

// Checks for available update and returns an instance
const pkg = require(path.resolve(__dirname, 'package.json'));
const notifier = updateNotifier({ pkg });

program.version('0.6.1', '-v, --version');

program.parse(process.argv);

if (notifier.update) {
  notifier.notify();
}

if (!process.argv.slice(2).length) {
  const screen = dialogue.screen();

  const branchTable = dialogue.branchTable();
  const statusBarText = dialogue.statusBarText();
  const helpDialogue = dialogue.helpDialogue();
  const question = dialogue.question();
  const statusBar = dialogue.statusBar();
  const statusHelpText = dialogue.statusHelpText();

  var currentRemote = 'local';
  var remoteList = [];

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
    git
      .doFetchBranches()
      .then(() => {
        branchTable.clearItems();

        refreshTable(currentRemote);
      })
      .catch(error => {
        screen.destroy();

        process.stderr.write('Cannot refresh fetch branches.');
        process.stderr.write(error);

        process.exit(1);
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

    question.setData([
      ['Create local branch named: ' + chalk.white.bold(gitBranch) + '?'],
      ['Yes'],
      ['No'],
    ]);

    // If selection is a remote, prompt if new branch is to be created.
    git
      .doCheckoutBranch(gitBranch, gitRemote)
      .then(() => {
        if (gitRemote) {
          screen.append(question);

          question.focus();

          screen.render();

          question.on('select', val => {
            const answer = val.content.trim();

            if (answer === 'Yes') {
              git
                .doCreateBranch(gitBranch)
                .then(() => {
                  screen.destroy();
                })
                .catch(error => {
                  screen.destroy();

                  process.stderr.write(
                    chalk.bold.red('[Err] ') +
                    'Unable checkout ' +
                    chalk.yellow(gitBranch) +
                    '\n'
                  );
                  process.stderr.write('\n', error);

                  process.exit(1);
                });
            }
          });
        }

        screen.destroy();

        process.stdout.write(
          chalk.bold.green('[Success] ') +
          'Checked out to ' +
          chalk.yellow(gitBranch) +
          '\n'
        );

        process.exit(0);
      })
      .catch(error => {
        screen.destroy();

        process.stderr.write(
          chalk.bold.red('[Err] ') +
          'Unable checkout ' +
          chalk.yellow(gitBranch) +
          '\n'
        );
        process.stderr.write(error);

        process.exit(1);
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

    var args = [];

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
    var currIndex = remoteList.indexOf(currentRemote);

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
    var currIndex = remoteList.indexOf(currentRemote);

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
  function refreshTable(currentRemote) {
    const listArray = git.buildListArray(currentRemote);

    var branchArray = [];

    git.buildRemoteList().then(results => {
      remoteList = results;

      statusBarText.content = getRemoteTabs(remoteList, currentRemote);

      screen.render();
    });

    listArray.then(
      results => {
        branchArray = results[currentRemote];

        branchTable.setData([
          ['', 'Remote', 'Branch Name', 'Path'],
          ...branchArray,
        ]);

        screen.render();
      },
      error => {
        screen.destroy();

        process.stderr.write('There was an error refreshing table: \n');
        process.stderr.write(error);

        process.exit(1);
      },
    );
  }

  refreshTable(currentRemote);
}
