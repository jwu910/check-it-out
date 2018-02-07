const program = require('commander');

program
  .version('0.0.1')

program
  .command('test')
  .action(() => {
    console.log('Placeholder event START');
  })

program.parse(process.argv);

if (program.args.length === 0) program.help();
