"use strict";
const log = console;
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const router = require("express").Router();

router.use(function(req, res, next) {
  log.info("database.config router taking control");
  next();
});

router.get("/roles", function(req, res, next) {
  res.send("hello roles");
});

// todo this needs to be POST
router.get("/roles/:name", function(req, res, next) {
  let params = {
    TableName: "tlauv-staging-tlauvTable-ZZDF5BP2PVKU",
    Item: {
      Path: "database/roles",
      Key: req.params.name,
      Value: {
        db_name: "mongodb",
        creation_statements: [
          {
            "db": "admin",
            "roles": [
              {
                "role": "read",
                "db": "foo"
              }
            ]
          }
        ],
        default_ttl: "1h",
        max_ttl: "24h"
      }
    }
  };

  docClient.put(params, function(err, data) {
    if (err) {
      log.error(err);
      res.status(500).send(err);
    } else {
      log.info(data);
      res.status(204).end();
    }
  });
});

module.exports = router;
