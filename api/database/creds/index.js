"use strict";
var log = console;

var router = require("express").Router();

router.use(function(req, res, next) {
  log.info("database.creds router taking control");
  next();
});

router.get("/creds", function(req, res, next){
  res.send("hello creds");
});

router.post("/creds/:name", function(req, res, next){
    res.send(req.params.name);
});

module.exports = router;