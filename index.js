#!/usr/bin/env node

const app = require('./lib/app');

if (process.stdin.isTTY) {
  app.start(process.argv.slice(2));
} else {
  process.stderr.write('Error: Cannot pipe into Check It Out');

  process.exit(1);
}
