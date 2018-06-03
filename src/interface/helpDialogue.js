import chalk from 'chalk';

export const helpDialogue() {
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
      border: { fg: THEME_COLOR },
    },
    bottom: 0,
    width: 'shrink',
  });

  return helpDialogue;
}

const helpText = () => {
  const text = [
    [chalk.bold('j/k, down/up'), 'Navigate the list'],
    [chalk.bold('h/l, left/right'), 'Previous/Next remote'],
    [chalk.bold('r'), 'Refresh with a fetch and prune'],
    [chalk.bold('enter'), 'Select highlighted item'],
    [chalk.bold('space'), 'Git log'],
    [chalk.bold('q, C-c, esc'), 'Quit'],
  ];

  return text;
};
