'use strict';

const chalk = require('chalk');

const helpText = () => {
  const text = [[chalk.bold('j/k, down/up'), 'Navigate the list'], [chalk.bold('h/l, left/right'), 'Previous/Next remote'], [chalk.bold('r'), 'Refresh with a fetch and prune'], [chalk.bold('enter'), 'Select highlighted item'], [chalk.bold('space'), 'Git log'], [chalk.bold('q, C-c, esc'), 'Quit']];

  return text;
};

module.exports = {
  helpText
};