"use strict";
const log = console;
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const router = require("express").Router();
const MongoClient = require("mongodb").MongoClient;
let lib = new require("./lib");
lib = new lib();

// todo move this into project root? seems like that's a better place for it.

router.use(function(req, res, next) {
  log.info("database.config router taking control");
  next();
});

router.get("/parameters", function(req, res, next) {
  res.send("hello params");
});

router.get("/parameters/:path", async function(req, res, next) {
  let mongo = await lib.connectToMongo();
  let params = await lib.getParameters();
  let users = await lib.createUsers(mongo, params.Item.Value);

  res.status(200).send("ok")
});

// pass this a role and path, which maps the path (from Param Store) to the role (from tlauv)
router.post("/parameters/:path", function(req, res, next) {
  log.info(data);
});

module.exports = router;
