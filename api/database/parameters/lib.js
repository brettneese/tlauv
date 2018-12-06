const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const MongoClient = require("mongodb").MongoClient;

function Lib() {
    // todo parameterize this
    this.url = "mongodb://localhost:27017";

  // // always initialize all instance properties
  // this.bar = bar;
  // this.baz = 'baz'; // default value
}

Lib.prototype.connectToMongo = async function connectToMongo(url) {
  return await MongoClient.connect(this.url);
};

Lib.prototype.getParameters = async function(path) {
//   let params = {
//     TableName: "tlauv-staging-tlauvTable-ZZDF5BP2PVKU",
//     Key: {
//       Path: "database/roles",
//       Key: path
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
      Key: "mongo"
    }
  };

  return(Promise.resolve(stub));
};

Lib.prototype.createUsers = async function(mongoClient, role) {
  client = await this.connectToMongo(this.url);

  const db = client.db(role.db);

  role.creation_statements.forEach(async(element) => {
    let createUser = {
      user: {
        username: "test",
        password: "password"
      },
      options: {
        roles: element.roles,
        customData: element.customData
        // w: - write concern
        // wtimeout: - write concern timeout
        // j: - journal timeout
      }
    };

    user = await db.addUser(
      createUser.user.username,
      createUser.user.password,
      createUser.options
    );
  });

  client.close();
};

module.exports = Lib;