"use strict";
const log = console;
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const router = require("express").Router();
const MongoClient = require("mongodb").MongoClient;

// todo move this into project root? seems like that's a better place for it.

router.use(function(req, res, next) {
  log.info("database.config router taking control");
  next();
});

router.get("/parameters", function(req, res, next) {
  res.send("hello params");
});

router.get("/parameters/:path", function(req, res, next) {
  let params = {
    TableName: "tlauv-staging-tlauvTable-ZZDF5BP2PVKU",
    Key: {
      Path: "database/roles",
      Key: req.params.path
    }
  };

  docClient.get(params, function(err, data) {

    // check if creds are cached in dynamodb first, then....
    
    if (err) console.log(err);
    else console.log(data);

    // Connection URL
    const url = "mongodb://localhost:27017";

    // Database Name
    const dbName = "myproject";

    // Use connect method to connect to the server
    MongoClient.connect(
      url,
      function(err, client) {
        console.log("Connected successfully to server");

        data.Item.Value.creation_statements.forEach(element => {
          const db = client.db(element.db);
          let createUser = {
            user: {
              username: "test",
              password: "password"
            },
            options: {
              roles: element.roles,
              customData: element.customData
              // w: - write concern
              // wtimeout: - write concern timeout
              // j: - journal timeout
            }
          };

          db.addUser(
            createUser.user.username,
            createUser.user.password,
            createUser.options,
            function(err, result) {

              // write to dynamo 

              if (err) log.error(err);
              if (result) res.status(200).send(result);
            }
          );
        });

        client.close();
      }
    );
  });
});

// pass this a role and path, which maps the path (from Param Store) to the role (from tlauv)
router.post("/parameters/:path", function(req, res, next) {
  log.info(data);
});

module.exports = router;
