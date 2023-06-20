#!/usr/bin/env node

import * as app from "./app";

app.start(process.argv.slice(2)).catch((error: Error) => {
  console.error(error);
  process.exit(1);
});
