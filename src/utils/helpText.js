import chalk from 'chalk';

export const helpText = () => {
  const text = [
    [chalk.bold('j/k, ▼/▲'), 'Navigate the list'],
    [chalk.bold('h/l, ◀/▶'), 'Previous/Next remote'],
    [chalk.bold('C-r'), 'Refresh with a fetch and prune'],
    [chalk.bold('enter'), 'Select highlighted item'],
    [chalk.bold('y'), 'Copy highlighted item'],
    [chalk.bold('space'), 'Git log'],
    [chalk.bold('&'), 'Filter lines - enter blank search to show all lines'],
    [chalk.bold('/'), 'Search lines'],
    [chalk.bold('n'), 'Jump to next search result'],
    [chalk.bold('N'), 'Jump to previous search result'],
    [chalk.bold('q, C-c, esc'), 'Quit'],
  ];

  return text;
};
