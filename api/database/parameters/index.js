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
  const mongoClient = await controller.connectToMongo();
  const roles = await controller.getRoles();
  const params = await controller.getParameters(req.params.path);
  const users = await controller.createUsers(mongoClient, roles.Item.Value);
  const output =  await controller.craftOutput(params, users);



  res.status(200).send(output.toString())
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
