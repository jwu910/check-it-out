#!/usr/bin/env node

const app = require('./dist/app');

app.start(process.argv.slice(2));
