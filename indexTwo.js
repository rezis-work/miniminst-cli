#!/usr/bin/env node

import path from "path";
import fs from "fs";
import minimist from "minimist";
import { Transform } from "stream";
import zlib from "zlib";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = minimist(process.argv.slice(2), {
  boolean: ["help", "in", "out", "compress", "uncompress"],
  string: ["file"],
});

const BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);

var OUTFILE = path.join(BASE_PATH, "out.txt");

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

  if (args.uncompress) {
    let gunzipStream = zlib.createGunzip();
    outStream = outStream.pipe(gunzipStream);
  }

  var upperStream = new Transform({
    transform(chunk, encoding, cb) {
      this.push(chunk.toString().toUpperCase());
      cb();
    },
  });

  outStream = outStream.pipe(upperStream);

  if (args.compress) {
    let gzipStream = zlib.createGzip();
    outStream = outStream.pipe(gzipStream);
    OUTFILE = `${OUTFILE}.gz`;
  }

  var targetStream;
  if (args.out) {
    targetStream = process.stdout;
  } else {
    targetStream = fs.createWriteStream(OUTFILE);
  }
  outStream.pipe(targetStream);
}

function printHelp() {
  console.log("indexTwo usage:");
  console.log(" indexTwo.js --file={FILENAME}");
  console.log("");
  console.log("--file                 file to process {FILENAME}");
  console.log("--help                 print this help");
  console.log("--out                  print to stdout");
  console.log("--compress             compress output with gzip");
  console.log("--uncompress           uncompress gzip input");
  console.log("");
}

function error(msg, includeHelp = false) {
  console.error(msg);
  if (includeHelp) {
    console.log("");
    printHelp();
  }
}
