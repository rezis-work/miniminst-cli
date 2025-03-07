#!/usr/bin/env node

"use strict";

import minimist from "minimist";
import sqlite3 from "sqlite3";
import util from "util";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const DB_PATH = path.join(dirname(__filename), "my.db");
const DB_SQL_PATH = path.join(dirname(__filename), "mydb.sql");

const args = minimist(process.argv.slice(2));

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

  // //////////////////////////////////////////////////////////////

  var otherID = await insertOrLookupOther(other);

  if (otherID) {
    let result = await insertSomething(otherID, something);
    if (result) {
      let records = await getAllRecords();
      if (records && records.length > 0) {
        console.table(records);
      }
    }
    return;
  }

  error("Opps!");
}

async function insertOrLookupOther(other) {
  var result = await SQL3.get(
    `
     SELECT id FROM other WHERE data = ?
    `,
    other
  );

  if (result && result.id) {
    return result.id;
  } else {
    result = await SQL3.run(
      `
       INSERT INTO other (data) VALUES (?)
      `,
      other
    );

    if (result && result.id) {
      return result.id;
    }
  }
}

async function insertSomething(otherID, something) {
  var result = await SQL3.run(
    `
      INSERT INTO something (otherID, data) VALUES (?, ?)
    `,
    otherID,
    something
  );

  if (result && result.changes > 0) {
    console.log("Inserted something", something);
    return true;
  }

  return false;
}

async function getAllRecords() {
  var result = await SQL3.all(
    `
     SELECT other.data AS "other", something.data AS "something"
     FROM something
     JOIN other ON (something.otherID = other.id)
     ORDER BY other.id DESC, something.data ASC
    `
  );
  if (result && result.length > 0) {
    return result;
  }

  return [];
}

function error(msg) {
  if (msg) {
    console.error(msg);
    console.log("");
  }
}

main();
