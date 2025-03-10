#!/usr/bin/env node

"use strict";

import util from "util";
import http from "http";
import path, { basename } from "path";
import sqlite3 from "sqlite3";
import staticAlias from "node-static-alias";
import { fileURLToPath } from "url";
import { dirname } from "path";
import express from "express";

var app = express();

const __filename = fileURLToPath(import.meta.url);
const DB_PATH = path.join(dirname(__filename), "my.db");
const WEB_PATH = path.join(dirname(__filename), "web");
const HTTP_PORT = 8039;

var delay = util.promisify(setTimeout);

// define some SQLite3 database helpers
//   (comment out if sqlite3 not working for you)
var myDB = new sqlite3.Database(DB_PATH);
var SQL3 = {
  run(...args) {
    return new Promise(function c(resolve, reject) {
      myDB.run(...args, function onResult(err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  },
  get: util.promisify(myDB.get.bind(myDB)),
  all: util.promisify(myDB.all.bind(myDB)),
  exec: util.promisify(myDB.exec.bind(myDB)),
};

var fileServer = new staticAlias.Server(WEB_PATH, {
  cache: 100,
  serverInfo: "Rezis server in action",
  alias: [
    {
      match: /^\/(?:index\/?)?(?:[?#].*$)?$/,
      serve: "index.html",
      force: true,
    },
    {
      match: /^\/js\/.+$/,
      serve: "<% absPath %>",
      force: true,
    },
    {
      match: /^\/(?:[\w\d]+)(?:[\/?#].*$)?$/,
      serve: function onMatch(params) {
        return `${params.basename}.html`;
      },
    },
    {
      match: /[^]/,
      serve: "404.html",
    },
  ],
});

var httpserv = http.createServer(app);

main();

// ************************************

function main() {
  defineRoutes();
  httpserv.listen(HTTP_PORT);
  console.log(`Listening on http://localhost:${HTTP_PORT}...`);
}

function defineRoutes() {
  app.get("/get-records", async function (req, res) {
    await delay(1000);
    var records = await getAllRecords();
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    });
    res.end(JSON.stringify(records));
  });
}

app.use(function (req, res, next) {
  if (/^\/(?:index\/?)?(?:[?#].*$)?$/.test(req.url)) {
    req.url = "/index.html";
  } else if (/^\/js\/.+/.test(req.url)) {
    next();
    return;
  } else if (/^\/(?:[\w\d]+)(?:[?#].*$)?$/.test(req.url)) {
    let basename = req.url.match(/^\/(?:[\w\d]+)/)[0];
    req.url = `${basename}.html`;
  } else {
    res.url = "/404.html";
  }
  next();
});

app.use(
  express.static(WEB_PATH, {
    maxAge: 10,
    setHeaders: (res) => {
      res.setHeader("Server", "Rezis server in action");
    },
  })
);

async function getAllRecords() {
  var result = await SQL3.all(
    `
		SELECT
			Something.data AS "something",
			Other.data AS "other"
		FROM
			Something
			JOIN Other ON (Something.otherID = Other.id)
		ORDER BY
			Other.id DESC, Something.data
		`
  );

  return result;
}
