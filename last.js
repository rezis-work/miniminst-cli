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
  var child = childProc.spawn("node", ["last-child.js"]);
  child.on("exit", function (code) {
    console.log("last-child.js exited with code", code);
  });
}
