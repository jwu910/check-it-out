'use strict';

var blessed = require('blessed');
var path = require('path');

var help = require(path.resolve(__dirname, 'helpText'));

var _require = require(path.resolve(__dirname, 'theme.json')),
    THEME_COLOR = _require.THEME_COLOR;

function branchTable() {
  var branchTable = blessed.listtable({
    align: 'left',
    height: '100%',
    left: 0,
    keys: true,
    noCellBorders: true,
    scrollable: true,
    scrollbar: true,
    style: {
      cell: {
        selected: {
          bg: '#FFFFFF',
          fg: '#272727'
        }
      },
      header: {
        fg: THEME_COLOR
      },
      label: {
        fg: '#FFFFFF'
      },
      scrollbar: {
        bg: THEME_COLOR
      }
    },
    tags: true,
    top: 0,
    vi: false,
    width: 'shrink'
  });

  return branchTable;
}

function helpDialogue() {
  var helpDialogue = blessed.table({
    align: 'left',
    border: { type: 'line' },
    data: help.helpText(),
    height: 'shrink',
    hidden: true,
    noCellBorders: true,
    padding: 1,
    right: 0,
    style: {
      border: { fg: THEME_COLOR }
    },
    bottom: 0,
    width: 'shrink'
  });

  return helpDialogue;
}

function screen() {
  var screen = blessed.screen({
    autoPadding: true,
    fullUnicode: true,
    smartCSR: true,
    title: 'Check It Out'
  });

  return screen;
}

function statusBar() {
  var statusBar = blessed.box({
    border: false,
    bottom: 0,
    height: 1,
    width: '100%'
  });

  return statusBar;
}

function statusBarText() {
  var statusBarText = blessed.text({
    content: '',
    left: 0,
    bottom: 0
  });

  return statusBarText;
}

function statusHelpText() {
  var statusHelpText = blessed.text({
    content: 'Press "?" to show/hide help.',
    right: 0
  });

  return statusHelpText;
}

module.exports = {
  branchTable: branchTable,
  statusBarText: statusBarText,
  helpDialogue: helpDialogue,
  screen: screen,
  statusBar: statusBar,
  statusHelpText: statusHelpText
};