const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const MongoClient = require("mongodb").MongoClient;
const micromustache = require("micromustache");
const crypto = require("crypto-extra");

exports.connectToMongo = async function connectToMongo(
  url = "mongodb://localhost:27017"
) {
  return Promise.resolve(MongoClient.connect(url));
};

exports.getRoles = async function(path) {
  //   let params = {
  //     TableName: "tlauv-staging-tlauvTable-ZZDF5BP2PVKU",
  //      Key: {
  //       Path: "database/roles",
  //       Key: pathd
  //     }
  //   };

  /// await docClient.get(params);

  const stub = {
    Item: {
      Path: "database/roles",
      Value: {
        db_name: "mongodb",
        max_ttl: "24h",
        creation_statements: [
          { db: "admin", roles: [{ db: "foo", role: "read" }] }
        ],
        default_ttl: "1h"
      },
      Key: "foo_role" // "role"
    }
  };

  return Promise.resolve(stub);
};

generateDynamicSecret = function(prefix, length = "64") {
  let secret = crypto.randomString(length);

  if (prefix) {
    return prefix + "-" + secret;
  }

  return secret;
};

exports.getParameters = async function(path) {
  const stub = {
    Item: {
      Path: "database/parameters",
      Value: {
        role: "foo_role",
        max_ttl: "24h",
        value: "mongodb://{{username}}:{{password}}@localhost:27017"
      },
      Key: "/api/development/foo_param"
    }
  };

  return Promise.resolve(stub);
};

// todo make a better name
// basically this does variable substitition to merge the created users with the param
exports.craftOutput = async function(parameters, users) {
  // todo check if array

  const oldValue = parameters.Item.Value.value;
  const user = users[0];
  const output = micromustache.render(oldValue, user);

  return output;
};

exports.createUsers = async function(mongoClient, roles) {
  console.log(roles);

  const role = roles.Value;
  const db = mongoClient.db(role.db);
  const users = [];

  role.creation_statements.forEach(async element => {

    let createUser = {
      user: {
        username: generateDynamicSecret(roles.Key, 3),
        password: generateDynamicSecret()
      },
      options: {
        roles: element.roles,
        customData: element.customData
        // w: - write concern
        // wtimeout: - write concern timeout
        // j: - journal timeout
      }
    };

    users.push(createUser.user);
    
    user = await db.addUser(
      createUser.user.username,
      createUser.user.password,
      createUser.options
    );

  });

  mongoClient.close();

  return Promise.resolve(users);
};
