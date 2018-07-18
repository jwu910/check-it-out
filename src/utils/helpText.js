const chalk = require('chalk');

export const helpText = () => {
  const text = [
    [chalk.bold('j/k, ▼/▲'), 'Navigate the list'],
    [chalk.bold('h/l, ◀/▶'), 'Previous/Next remote'],
    [chalk.bold('C-r'), 'Refresh with a fetch and prune'],
    [chalk.bold('enter'), 'Select highlighted item'],
    [chalk.bold('space'), 'Git log'],
    [chalk.bold('q, C-c, esc'), 'Quit'],
  ];

  return text;
};
