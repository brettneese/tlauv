"use strict";
var log = console;

var router = require("express").Router();

router.use(function(req, res, next) {
  log.info("Database router taking control");
  next();
});

router.use(require("./config/"));
router.use(require("./creds/"));
router.use(require("./roles/"));
router.use(require("./parameters/"));

// needs to match serverless.yml routes
router.routerPath = ["/database/"];

exports.handler = require("express-lambda-helper").createHandler(router);
