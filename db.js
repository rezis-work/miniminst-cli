#!/usr/bin/env node

"use strict";

import sqlite3 from "sqlite3";
import util from "util";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const DB_PATH = path.join(dirname(__filename), "my.db");
const DB_SQL_PATH = path.join(dirname(__filename), "mydb.sql");

var SQL3;

async function main() {
  if (!args.other) {
    error("Missing '--other=..'");
    return;
  }

  var myDB = new sqlite3.Database(DB_PATH);
  SQL3 = {
    run(...args) {
      return new Promise((resolve, reject) => {
        myDB.run(...args, function (err) {
          if (err) return reject(err);
          resolve(this);
        });
      });
    },

    get: util.promisify(myDB.get.bind(myDB)),
    all: util.promisify(myDB.all.bind(myDB)),
    exec: util.promisify(myDB.exec.bind(myDB)),
  };

  var initSQL = fs.readFileSync(DB_SQL_PATH, "utf8");
  await SQL3.exec(initSQL);

  var other = args.other;
  var something = Math.trunc(Math.random() * 1e9);

  // error("Opps");
}

function error(msg) {
  if (msg) {
    console.error(msg);
    console.log("");
  }
}

main();
