"use strict";
var log = console;

var router = require("express").Router();

router.use(function(req, res, next) {
  log.info("database.config router taking control");
  next();
});

router.post("/:name", function(req, res, next){
    res.send(req.params.name);
});

module.exports = router;