const blessed = require('blessed');

const help = require('./helpText');
const { THEME_COLOR } = require('./theme');

function branchTable() {
  const branchTable = blessed.listtable({
    align: 'left',
    border: { type: 'line' },
    height: '90%',
    left: 0,
    keys: true,
    noCellBorders: true,
    scrollbar: true,
    style: {
      border: { fg: THEME_COLOR },
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
    vi: true,
    width: 'shrink',
  });

  return branchTable;
}

function helpDialogue() {
  const helpDialogue = blessed.table({
    align: 'left',
    border: { type: 'line' },
    data: help.helpText(),
    height: 'shrink',
    hidden: true,
    noCellBorders: true,
    right: 0,
    style: {
      border: { fg: THEME_COLOR },
    },
    bottom: 0,
    width: 'shrink',
  });

  return helpDialogue;
}

function question() {
  const question = blessed.listtable({
    align: 'left',
    border: { type: 'line' },
    height: '20%',
    keys: true,
    left: 2,
    style: {
      border: { fg: THEME_COLOR },
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
    top: '30%',
    vi: true,
    width: 'shrink',
  });

  return question;
}

function screen() {
  const screen = blessed.screen({
    autoPadding: true,
    fullUnicode: true,
    smartCSR: true,
    title: 'Check It Out',
  });

  return screen;
}

function statusBar() {
  const statusBar = blessed.box({
    border: { type: 'line' },
    bottom: 0,
    height: 3,
    right: 0,
    style: {
      border: { fg: THEME_COLOR },
    },
    shrink: true,
    width: 'shrink',
  });

  return statusBar;
}

function statusHelpText() {
  const statusHelpText = blessed.text({
    content: 'Press "?" to show/hide help.',
    right: 0,
  });

  return statusHelpText;
}

module.exports = {
  branchTable,
  helpDialogue,
  question,
  screen,
  statusBar,
  statusHelpText,
};
