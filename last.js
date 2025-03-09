#!/usr/bin/env node

"use strict";

import util from "util";
import childProc from "child_process";
// import fetch from "node-fetch";

// ************************************

const HTTP_PORT = 8039;
const MAX_CHILDREN = 5;

var delay = util.promisify(setTimeout);

main().catch(() => 1);

// ************************************

async function main() {
  console.log(`Load testing http://localhost:${HTTP_PORT}...`);

  while (true) {
    process.stdout.write(`Trying ${MAX_CHILDREN} child processes...`);

    let children = [];
    for (let i = 0; i < MAX_CHILDREN; i++) {
      children.push(childProc.spawn("node", ["last-child.js"]));
    }

    let resps = children.map(function (child) {
      return new Promise(function (res) {
        child.on("exit", function (code) {
          if (code == 0) res(true);
          res(false);
        });
      });
    });

    resps = await Promise.all(resps);

    if (resps.filter(Boolean).length == MAX_CHILDREN) {
      console.log("success");
    } else {
      console.log("failure");
    }

    console.log("done");

    await delay(500);
  }
}
