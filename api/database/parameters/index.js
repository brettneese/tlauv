"use strict";
const log = console;
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const router = require("express").Router();
const MongoClient = require("mongodb").MongoClient;
const controller = require("./controller");


// todo move this into project root? seems like that's a better place for it.

router.use(function(req, res, next) {
  log.info("database.config router taking control");
  next();
});

router.get("/parameters", function(req, res, next) {
  res.send("hello params");
});

router.get("/parameters/:path", async function(req, res, next) {
  let mongoClient = await controller.connectToMongo();
  let params = await controller.getParameters();
  let users = await controller.createUsers(mongoClient, params.Item.Value);

  res.status(200).send("ok")
});

// pass this a role, path, and value template which maps the path (from Param Store) to the role (from tlauv)
router.post("/parameters/:path", function(req, res, next) {
  const stub = {
    Item: {
      Path: "database/parameters",
      Value: {
        role: "foo_role",
        max_ttl: "24h",
        value: "mongodb://{{username}}:{{password}}@localhost:27017"
      },
      Key: "/api/development/foo_param"
    }
  };


  log.info(stub);
});

module.exports = router;
