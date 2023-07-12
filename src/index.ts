#!/usr/bin/env node

import * as app from "./app.js";

app.start(process.argv.slice(2)).catch((error: Error) => {
  console.error(error);
  process.exit(1);
});
