import blessed, { Widgets } from "blessed";

import * as config from "./config.js";
import * as help from "./helpText.js";
import { ListTable } from "../types.js";

const themeColor = config.getThemeColor();

const baseStyles = {
  border: undefined,
  width: "100%",
};

/**
 * Blessed Loading element
 *
 * @returns {Widgets.LoadingElement}
 */
const loading = (): Widgets.LoadingElement => {
  const loading = blessed.loading({
    align: "center",
    width: "shrink",
    top: "0",
    left: "0",
  });

  return loading;
};

/**
 * Blessed ListTable element for branch list
 *
 * @returns {ListTable}
 */
const branchTable = (): ListTable => {
  const branchTable = blessed.listtable({
    align: "left",
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
          bg: "#FFFFFF",
          fg: "#272727",
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
    width: "shrink",
  });

  return branchTable as ListTable;
};

/**
 * Blessed Table element for help dialogue
 *
 * @returns {Widgets.TableElement}
 */
const helpDialogue = (): Widgets.TableElement => {
  const helpDialogue = blessed.table({
    align: "left",
    border: { type: "line" },
    data: help.helpText(),
    height: "shrink",
    hidden: true,
    noCellBorders: true,
    padding: 1,
    right: 0,
    style: {
      border: { fg: themeColor },
    },
    bottom: 0,
    width: "shrink",
  });

  return helpDialogue;
};

/**
 * Blessed Textarea element for input
 *
 * @param {string} label
 * @param {string} startingValue
 * @param {Function} cb
 * @returns {Widgets.TextareaElement}
 */
const input = (
  label: string,
  startingValue: string,
  cb: Function,
): Widgets.TextareaElement => {
  const input = blessed.textarea({
    border: { fg: 3, type: "line" },
    bottom: 0,
    height: 3,
    inputOnFocus: true,
    label,
    left: 0,
    name: "searchInput",
    padding: {
      left: 1,
    },
    right: 0,
    value: startingValue,
    width: "100%",
  });

  input.onceKey("enter", () => {
    cb(input.value.trim());
    input.submit();
  });
  input.on("action", () => {
    input.destroy();
    input.screen.render();
  });

  return input;
};

/**
 * Blessed Log element for message center
 *
 * @returns {Widgets.Log}
 */
const messageCenter = (): Widgets.Log => {
  const messageCenter = blessed.log({
    ...baseStyles,
    bottom: 2,
    height: 5,
  });

  return messageCenter;
};

/**
 * Blessed Screen element
 *
 * @returns {Widgets.Screen}
 */
const screen = (): Widgets.Screen => {
  const screen = blessed.screen({
    autoPadding: true,
    fullUnicode: true,
    ignoreLocked: ["C-c"],
    smartCSR: true,
  });

  return screen;
};

/**
 * Blessed Box element for status bar container
 *
 * @returns {Widgets.BoxElement}
 */
const statusBarContainer = (): Widgets.BoxElement => {
  const statusBarContainer = blessed.box({
    ...baseStyles,
    bottom: 0,
    height: 3,
  });

  return statusBarContainer;
};

/**
 * Blessed Box element for status bar
 *
 * @returns {Widgets.BoxElement}
 */
const statusBar = (): Widgets.BoxElement => {
  const statusBar = blessed.box({
    ...baseStyles,
    bottom: 0,
    height: 1,
  });

  return statusBar;
};

/**
 * Blessed Text element for status bar text
 *
 * @returns {Widgets.TextElement}
 */
const statusBarText = (): Widgets.TextElement => {
  const statusBarText = blessed.text({
    content: "",
    bottom: 0,
    left: 0,
  });

  return statusBarText;
};

/**
 * Blessed Text element for status bar help text
 *
 * @returns {Widgets.TextElement}
 */
const statusHelpText = (): Widgets.TextElement => {
  const statusHelpText = blessed.text({
    bottom: 0,
    content: 'Press "?" to show/hide help.',
    right: 2,
  });

  return statusHelpText;
};

export {
  loading,
  branchTable,
  helpDialogue,
  input,
  messageCenter,
  screen,
  statusBarContainer,
  statusBar,
  statusBarText,
  statusHelpText,
};
