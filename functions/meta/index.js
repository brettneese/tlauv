"use strict";
const config = require("./config");
const log = require("@hbkapps/logger")(__filename);
const lambdaWarm = require("islambdawarm");
const requestContext = require("lambda-request-context");

function response(event, context, callback) {

  let properties = {
    secret: config.SECRET
  };

  log.info("Incoming message: ", properties, event);

  ////
  // Use this code if you use the http event with the LAMBDA-PROXY integration to return HTTP events
  const response = {
    statusCode: 200,
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({
      message: 'Hello world!',
      input: event,
      properties: properties
    }),
  };
  callback(null, response);
  //

  ////
  // use this code if you're not doing HTTP things
  //callback(null, { message: "Hello world!", event });
  ////
}

module.exports.handler = (event, context, callback) => {
  const finishedBootingAt = Date.now();

  // set up debug log handling
  if (event.headers && event.headers["Debug-Log-Enabled"] === "true") {
    requestContext.set("Debug-Log-Enabled", "true");
  } else {
    // enable debug logging on 5% of cases
    var debugLogEnabled = Math.random() < 0.05 ? "true" : "false";
    requestContext.set("Debug-Log-Enabled", debugLogEnabled);
  }

  // configure lambdaWarm to capture lambda's warmth
  lambdaWarm(function(err, warm, startedBootingAt) {
    if (err) {
      log.error(err);
    }

    if (!warm) {
      log.info("Function booted: ", {
        bootTime: finishedBootingAt - startedBootingAt
      });
    }

    log.debug("Lambda warm since: ", startedBootingAt);

    requestContext.set("lambdaWarm", warm);
    requestContext.set("lambdaWarmSince", startedBootingAt);

    return response(event, context, callback);
  });
};
