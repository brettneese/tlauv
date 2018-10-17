var config = {
  SECRET: {
    doc: "A secret",
    format: "String",
    env: "SECRET",
    default: "shhhhhhh",
    providerPath:
      "/severless-node/" + process.env.STAGE + "/meta/SECRET"
  }
};

var convict = require("@hbkapps/convict");
convict.configureProvider(require("@hbkapps/convict-provider-awsssm"));
module.exports = convict(config)
  .validate()
  .getProperties();
