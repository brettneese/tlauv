"use strict";
const log = console;
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const router = require("express").Router();

router.use(function(req, res, next) {
  log.info("database.config router taking control");
  next();
});

router.get("/config", function(req, res, next) {
  res.send("hello config");
});

router.get("/config/:name", function(req, res, next) {
  let params = {
    TableName: "tlauv-staging-tlauvTable-ZZDF5BP2PVKU",
    Item: {
      Path: "database/config",
      Key: req.params.name,
      Value: {
        plugin_name: "mongodb-database-plugin",
        allowed_roles: "readonly",
        connection_url:
          "mongodb://{{username}}:{{password}}@mongodb.acme.com:27017/admin?ssl=true",
        write_concern: '{ "wmode": "majority", "wtimeout": 5000 }',
        username: "admin",
        password: "Password!"
      }
    }
  };

  docClient.put(params, function(err, data) {
    if (err) {
      log.error(err);
      res.status(500);
    } else {
      log.info(data);
      res.status(204);
    }
  });
});

module.exports = router;
