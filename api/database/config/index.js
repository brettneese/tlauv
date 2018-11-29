"use strict";
var log = console;

var router = require("express").Router();

router.use(function(req, res, next) {
  log.info("database.config router taking control");
  next();
});

router.get("/config", function(req, res, next){
  res.send("hello config");
});

router.post("/config/:name", function(req, res, next){
    res.send(req.params.name);
});

module.exports = router;