"use strict";
const log = console;
const router = require("express").Router();

router.use(function(req, res, next) {
  log.info("database.roles router taking control");
  next();
});

router.get("/roles", function(req, res, next){
  res.send("hello roles");
});

router.post("/roles/:name", function(req, res, next){
    res.send(req.params.name);
});

module.exports = router;