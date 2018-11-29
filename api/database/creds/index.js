"use strict";
var log = console;

var router = require("express").Router();

router.use(function(req, res, next) {
  log.info("database.creds router taking control");
  next();
});

router.get("/creds", function(req, res, next) {
  res.send("hello creds");
});

router.get("/creds/:role", function(req, res, next) {
  let response = {
    data: {
      username: "root-1430158508-126",
      password: "132ae3ef-5a64-7499-351e-bfe59f3a2a21"
    }
  };

  res.send(response);
});

module.exports = router;
