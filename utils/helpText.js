const chalk = require('chalk');
const helpText = () => {
  const text =
    chalk.bold('j/k, down/up') +  ' - Navigate the list\n' +
    chalk.bold('r') + ' - Fetch, prune, and refresh list\n' +
    chalk.bold('l, enter') + ' - Select highlighted item\n' +
    chalk.bold('q, C-c, esc') + ' - Exit check-it-out';

    return text;
}

module.exports = {
  helpText: helpText
}