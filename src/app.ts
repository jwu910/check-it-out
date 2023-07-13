import chalk from "chalk";
import { write as copyToClipBoard } from "clipboardy";
import stripAnsi from "strip-ansi";
import updateNotifier from "update-notifier";

import { Logger } from "./types.js";
import * as config from "./utils/config.js";
import {
  closeGitResponse,
  doCheckoutBranch,
  doFetchBranches,
  getRefData,
} from "./utils/git.js";
import * as dialogue from "./utils/interface.js";
import * as packageInfo from "./utils/packageInfo.js";
import { getState } from "./utils/state.js";

// Checks for available update and returns an instance
const notifier = updateNotifier({
  pkg: { name: packageInfo.name, version: packageInfo.version },
});

if (notifier.update) {
  const notifierMessage = `\
  New ${chalk.yellow(notifier.update.type)} version of ${
    notifier.update.name
  } available ${chalk.red(notifier.update.current)} ➜  ${chalk.green(
    notifier.update.latest,
  )}\
  \n${chalk.yellow("Changelog:")} ${chalk.blue(
    `https://github.com/jwu910/check-it-out/releases/tag/v${notifier.update.latest}`,
  )}\
  \nRun ${chalk.green("npm i -g check-it-out")} to update!`;

  notifier.notify({ message: notifierMessage });
}

/**
 * Start the application
 *
 * @param {string[]} args
 */
export const start = async (args: string[]) => {
  if (args[0] === "-v" || args[0] === "--version") {
    process.stdout.write(packageInfo.version + "\n");
    process.exit(0);
  } else if (args[0] === "--reset-config") {
    config.resetConfig();
  }

  const gitLogArguments = config.getGitLogArguments();
  const screen = dialogue.screen();

  const branchTable = dialogue.branchTable();
  const loadDialogue = dialogue.loading();
  const messageCenter = dialogue.messageCenter();
  const helpDialogue = dialogue.helpDialogue();

  const statusBarContainer = dialogue.statusBarContainer();
  const statusBar = dialogue.statusBar();
  const statusBarText = dialogue.statusBarText();
  const statusHelpText = dialogue.statusHelpText();

  function sendMessage(prefix: string, message: string) {
    messageCenter.log(`[${prefix}] ${message}`);
  }
  const logger: Logger = {
    error(message: string) {
      sendMessage(chalk.bold.red("error"), message);
    },
    log(message: string) {
      sendMessage("log", message);
    },
  };

  const state = getState(logger);

  screen.append(branchTable);
  screen.append(statusBarContainer);

  statusBar.append(statusBarText);
  statusBar.append(statusHelpText);

  statusBarContainer.append(messageCenter);
  statusBarContainer.append(statusBar);
  statusBarContainer.append(messageCenter);
  statusBarContainer.append(helpDialogue);

  screen.append(loadDialogue);

  loadDialogue.load(" Building project reference lists");

  screen.render();

  const toggleHelp = () => {
    helpDialogue.toggle();
    screen.render();
  };

  screen.key("?", toggleHelp);
  screen.key(["escape", "q", "C-c"], () => {
    if (screen.lockKeys) {
      closeGitResponse();

      logger.log("Cancelled git process");
    } else {
      process.exit(0);
    }
  });
  screen.key("C-r", async () => {
    branchTable.clearItems();

    loadDialogue.load(" Fetching refs...");

    logger.log("Fetching");

    try {
      await doFetchBranches();

      branchTable.clearItems();

      refreshTable();
    } catch (error) {
      loadDialogue.stop();

      refreshTable();

      logger.error(error as string);
    }
  });

  function getPrompt(label: string, cb: Function) {
    const input = dialogue.input(label, "", cb);

    screen.append(input);

    input.show();
    input.focus();

    screen.render();
  }

  screen.key("&", () => {
    getPrompt("Filter term:", (value: string) => {
      state.setFilter(value);

      refreshTable();
    });
  });

  screen.key("/", () => {
    getPrompt("Search term:", (value: string) => {
      state.setSearch(value);

      refreshTable();
    });
  });

  process.on("SIGWINCH", () => {
    screen.emit("resize");

    logger.log("Resizing");
  });

  /**
   * Trim and remove whitespace from selected line.
   *
   * @param  {string} selectedLine String representation of selected line.
   * @returns {string[]} Array of selected line.
   */
  const parseSelection = (selectedLine: string) => {
    const selection = stripAnsi(selectedLine)
      .split(/\s*\s/)
      .map((column) => {
        return column === "heads" ? "" : column;
      });

    return selection;
  };

  branchTable.on("select", async (selectedLine: { content: string }) => {
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
      if ((error as string) !== "SIGTERM") {
        screen.destroy();

        process.stderr.write(
          chalk.bold.red("[ERR] ") +
            "Unable to checkout " +
            chalk.yellow(gitBranch) +
            "\n" +
            (error as string),
        );

        process.exit(1);
      } else {
        refreshTable();

        logger.error(error as string);
      }
    }
  });

  branchTable.key(["left", "h"], () => {
    state.setCurrentRemoteIndex(Math.max(state.currentRemoteIndex - 1, 0));

    refreshTable();
  });

  branchTable.key(["right", "l"], () => {
    state.setCurrentRemoteIndex(
      Math.min(state.currentRemoteIndex + 1, state.remotes.length - 1),
    );

    refreshTable();
  });

  branchTable.key("j", () => {
    branchTable.down(1);

    screen.render();
  });

  branchTable.key("k", () => {
    branchTable.up(1);

    screen.render();
  });

  branchTable.key("n", () => {
    const currentRefIndex = branchTable.selected;
    const filteredHits = state.searchHits.filter(
      (n: number) => n > currentRefIndex,
    );

    if (filteredHits.length) {
      branchTable.select(filteredHits[0]);
      screen.render();
    }
  });

  branchTable.key("S-n", () => {
    const currentRefIndex = branchTable.selected;
    const filteredHits = state.searchHits.filter(
      (n: number) => n < currentRefIndex,
    );

    if (filteredHits.length) {
      branchTable.select(filteredHits[filteredHits.length - 1]);
      screen.render();
    }
  });

  branchTable.key("space", function () {
    const selection = parseSelection(
      branchTable.items[branchTable.selected].content,
    );

    const gitBranch = selection[2];
    const gitRemote = selection[1];

    let args: string[] = [];

    if (gitRemote) {
      args.push(gitRemote);
    }

    args.push(gitBranch);

    screen.spawn("git", ["log", args.join("/"), ...gitLogArguments]);
  });

  branchTable.key("y", async function () {
    const selection = parseSelection(
      branchTable.items[branchTable.selected].content,
    );
    const gitBranch = selection[2];
    try {
      await copyToClipBoard(gitBranch);
      logger.log(`"${gitBranch}" copied to clipboard`);
    } catch (error) {
      logger.error(`Unable to copy : ${JSON.stringify(error)}`);
    }
  });

  branchTable.focus();

  /**
   * Update current screen with current remote
   */
  const refreshTable = () => {
    const tableData = state.currentRemote.refs
      .filter(
        (ref: { name: string }) => ref.name.search(state.filterRegex) !== -1,
      )
      .map((ref: { active: any; remoteName: any; name: string }) => [
        ref.active ? "*" : " ",
        ref.remoteName,
        ref.name.replace(state.searchRegex, (match: unknown) =>
          chalk.inverse(match),
        ),
      ]);

    branchTable.setData([["", "Remote", "Ref Name"], ...tableData]);

    const tabNames = state.remotes.map((remote: { name: any }, index: any) => {
      let name = remote.name;

      if (index === state.currentRemoteIndex) {
        name = chalk.inverse(name);
      }

      return name;
    });

    statusBarText.content = tabNames.join(":");

    loadDialogue.stop();

    screen.render();

    logger.log("Screen refreshed");
  };

  try {
    state.setRemotes(await getRefData());

    state.setCurrentRemoteIndex(
      state.remotes.findIndex(
        (remote: { name: string }) => remote.name === "heads",
      ),
    );

    refreshTable();

    logger.log("Loaded successfully");
  } catch (err) {
    screen.destroy();

    if (err === "SIGTERM") {
      process.stdout.write(chalk.white.bold("[INFO]") + "\n");
      process.stdout.write(
        "Check it out closed before initial load completed \n",
      );

      process.exit(0);
    } else {
      process.stderr.write(chalk.red.bold("[ERROR]") + "\n");
      process.stderr.write(err + "\n");

      process.exit(1);
    }
  }
};
