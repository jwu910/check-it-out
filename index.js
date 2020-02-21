#!/usr/bin/env node

const app = require('./dist/app');

const args = process.argv
  .slice(2)
  .reduce((acc, val) => acc.concat(val.split('=')), []); // support both "key=val" and "key val"

app.start(args).catch(error => {
  console.error(error);
  process.exit(1);
});
