const chalk = require('chalk');

const helpText = () => {
  const text = [
    [chalk.bold('j/k, down/up'), 'Navigate the list'],
    [chalk.bold('h/l, left/right'), 'Previous/Next remote'],
    [chalk.bold('r'), 'Fetch, prune, and refresh list'],
    [chalk.bold('enter'), 'Select highlighted item'],
    [chalk.bold('q, C-c, esc'), 'Exit check-it-out'],
  ];

  return text;
};

module.exports = {
  helpText,
};
