"use strict";
var log = console;
var router = require("express").Router();
const AWS = require("aws-sdk");
const bodyParser = require("body-parser");
const util = require("util");

router.use(function(req, res, next) {
  log.info("Proxy router taking control");
  next();
});

router.use(bodyParser.json({ type: "application/x-amz-json-1.1" }));

router.post("/*", function(req, res, next) {
  let target = getTarget(req);

  var ssm = new AWS.SSM({
    region: "us-east-1"
  });

  ssm[target](req.body, function(err, data) {
    if (err) {
      res.status(err.statusCode).send(err.code);
    } else {
      res.status(200).send(data);
    }
  });
});

// takes a request and gets the target API method to call in camel-case format
function getTarget(req) {
  let target = req.headers["x-amz-target"];
  target = lowerCaseFirstLetter(target.split(".")[1]);

  return target;
}

// lower-cases the first letter of a string
function lowerCaseFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

// needs to match serverless.yml routes
router.routerPath = ["/proxy"];

exports.handler = require("express-lambda-helper").createHandler(router);
