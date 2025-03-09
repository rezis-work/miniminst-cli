"use strict";

// import fetch from "node-fetch";

const HTTP_PORT = 8039;

main().catch(() => 1);

// ************************************

async function main() {
  for (let i = 0; i < 10000000000; i++) {
    i = i + 1;
  }
  process.exitCode = 1;
}
