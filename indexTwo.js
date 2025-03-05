#!/usr/bin/env node

import path from "path";
import fs from "fs";
import getStdin from "get-stdin";
import minimist from "minimist";

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
  getStdin().then(processFile).catch(error);
} else if (args.file) {
  fs.readFile(
    path.join(BASE_PATH, args.file),
    "utf8",
    function onContents(err, contents) {
      if (err) {
        error(err.toString(), true);
      } else {
        processFile(contents);
      }
    }
  );
} else {
  error("Incorrect usage", true);
}

// ***********************************************

function processFile(contents) {
  contents = contents.toUpperCase();
  process.stdout.write(contents);
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

var stream1; // readable stream
var stream2; // writable stream
var stream3; // readable stream

stream3 = stream1.pipe(stream2).pipe(stream5).pipe(final);
