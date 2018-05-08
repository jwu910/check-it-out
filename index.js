#!/usr/bin/env node

const app = require('./lib/app');

if (!process.argv.slice(2).length) {
  app.start();
}
else {

}
