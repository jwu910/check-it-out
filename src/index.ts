#!/usr/bin/env node

import { start } from "./app.js";

(async () => {
  try {
    await start(process.argv.slice(2));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
