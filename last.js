#!/usr/bin/env node

"use strict";

import util from "util";
import childProc from "child_process";
// import fetch from "node-fetch";

// ************************************

const HTTP_PORT = 8039;

var delay = util.promisify(setTimeout);

main().catch(() => 1);

// ************************************

async function main() {
  console.log(`Load testing http://localhost:${HTTP_PORT}...`);
  for ()

  while (true) {
    process.stdout.write(`Trying ${MAX_CHILDREN} child processes...`);

    var child = childProc.spawn("node", ["last-child.js"]);
    child.on("exit", function (code) {
      //  code == 0
    });

    console.log("done");

    await delay(500);
  }
}
