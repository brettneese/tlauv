"use strict";
var log = console;

var router = require("express").Router();

router.use(function(req, res, next) {
  log.info("Meta router taking control");
  next();
});

router.get("/", function(req, res, next) {

  res.send("hello world");
});

// needs to match serverless.yml routes
router.routerPath = ["/status"];

exports.handler = require("express-lambda-helper").createHandler(router);