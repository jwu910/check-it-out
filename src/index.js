#!/usr/bin/env node

const app = require("./app");

app.start(process.argv.slice(2)).catch((error) => {
  console.error(error);
  process.exit(1);
});
