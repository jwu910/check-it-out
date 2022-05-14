// import { Widgets } from '@types/blessed';
import blessed, { Widgets } from 'blessed';
import path from 'path';
import Configstore from 'configstore';

import * as help from './helpText';
const pkg = require(path.resolve(__dirname, '../../package.json'));

const conf = new Configstore(pkg.name);
const themeColor = conf.get('themeColor');

const baseStyles = {
  border: undefined,
  width: '100%',
};

export const loading = (): Widgets.LoadingElement => {
  const loading = blessed.loading({
    align: 'center',
    width: 'shrink',
    top: '0',
    left: '0',
  });

  return loading;
};

export const branchTable = (): Widgets.ListTableElement => {
  const branchTable = blessed.listtable({
    align: 'left',
    left: 0,
    keys: true,
    right: 0,
    noCellBorders: true,
    scrollable: true,
    scrollbar: {
      style: { bg: themeColor },
    },
    style: {
      cell: {
        selected: {
          bg: '#FFFFFF',
          fg: '#272727',
        },
      },
      header: {
        fg: themeColor,
      },
    },
    tags: true,
    top: 0,
    bottom: 8,
    vi: false,
    width: 'shrink',
  });

  return branchTable;
};

export const helpDialogue = (): Widgets.TableElement => {
  const helpDialogue = blessed.table({
    align: 'left',
    border: { type: 'line' },
    data: help.helpText(),
    height: 'shrink',
    hidden: true,
    noCellBorders: true,
    padding: 1,
    right: 0,
    style: {
      border: { fg: themeColor },
    },
    bottom: 0,
    width: 'shrink',
  });

  return helpDialogue;
};

export const input = (label: string, startingValue: string, cb: Function) => {
  const input = blessed.textarea({
    border: { fg: 3, type: 'line' },
    bottom: 0,
    height: 3,
    inputOnFocus: true,
    label,
    left: 0,
    name: 'searchInput',
    padding: {
      left: 1,
    },
    right: 0,
    value: startingValue,
    width: '100%',
  });

  input.onceKey('enter', () => {
    cb(input.value.trim());
    input.submit();
  });
  input.on('action', () => {
    input.destroy();
    input.screen.render();
  });

  return input;
};

export const messageCenter = (): Widgets.Log => {
  const messageCenter = blessed.log({
    ...baseStyles,
    bottom: 2,
    height: 5,
  });

  return messageCenter;
};

export const screen = (): Widgets.Screen => {
  const screen = blessed.screen({
    autoPadding: true,
    fullUnicode: true,
    ignoreLocked: ['C-c'],
    smartCSR: true,
  });

  return screen;
};

export const statusBarContainer = (): Widgets.BoxElement => {
  const statusBarContainer = blessed.box({
    ...baseStyles,
    bottom: 0,
    height: 3,
  });

  return statusBarContainer;
};

export const statusBar = (): Widgets.BoxElement => {
  const statusBar = blessed.box({
    ...baseStyles,
    bottom: 0,
    height: 1,
  });

  return statusBar;
};

export const statusBarText = (): Widgets.TextElement => {
  const statusBarText = blessed.text({
    content: '',
    bottom: 0,
    left: 0,
  });

  return statusBarText;
};

export const statusHelpText = (): Widgets.TextElement => {
  const statusHelpText = blessed.text({
    bottom: 0,
    content: 'Press "?" to show/hide help.',
    right: 2,
  });

  return statusHelpText;
};
