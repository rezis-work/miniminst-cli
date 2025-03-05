#!/usr/bin/env node

import path from "path";
import fs from "fs";
import minimist from "minimist";
import { Transform } from "stream";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = minimist(process.argv.slice(2), {
  boolean: ["help"],
  string: ["file"],
});

const BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);

if (args.help) {
  printHelp();
} else if (args.in || args._.includes("-")) {
  processFile(process.stdin);
} else if (args.file) {
  let stream = fs.createReadStream(path.join(BASE_PATH, args.file), "utf8");
  processFile(stream);
} else {
  error("Incorrect usage", true);
}

// ***********************************************

function processFile(inStream) {
  var outStream = inStream;

  var upperStream = new Transform({
    transform(chunk, encoding, cb) {
      this.push(chunk.toString().toUpperCase());
      setTimeout(() => {
        cb();
      }, 200);
    },
  });

  outStream = outStream.pipe(upperStream);

  var targetStream = process.stdout;
  outStream.pipe(targetStream);
}

function printHelp() {
  console.log("index usage:");
  console.log(" index.js --file={FILENAME}");
  console.log("");
  console.log("--file                 file to process {FILENAME}");
  console.log("--help                 print this help");
  console.log("");
}

function error(msg, includeHelp = false) {
  console.error(msg);
  if (includeHelp) {
    console.log("");
    printHelp();
  }
}
