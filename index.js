#!/usr/bin/env node

const app = require('./lib/app');

app.start(process.argv.slice(2));