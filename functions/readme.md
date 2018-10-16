# Functions

This directory, usually called functions or sometimes called "packages" is where the individual Lambda functions that make up your application live. Generally, multiple functions make up a _service_, and multiple services (for instance, a backend and a frontend) make up a _project_. Function names should be camelCased with no hyphens. 

## Function structure overview

Functions usually consist of at least a package manifest (`package.json` and `package-lock.json`), a node module (`index.js`), and a test for the module, `index.spec.js`. They also usually consist of a configuration file, `config.js`; some documentation, `readme.md`; and sometimes some custom Cloudformation resources (`resources.yaml`).

### Packaging - `package.json`

Contrary to the way the Serverless Framework usually works, packaging is usually done on a per function basis, and internal dependencies should generally not be shared between functions in a project. Package names should be called `@hbkapps/service-name-functionName` - dasherized service name, camel-cased function name that corresponds with the function directory name. This makes it easier to run Lerna scripts across the multiple parts of the repository. 

It is possible to have a library that's shared across multiple functions but this process is outside of the scope of this documentation currently and is generally not recommended (see `chartroom-api` for an example of this in practice.)

_Note: do not install any devDependencies in any package. While it is useful to run ie `mocha` in a function scope, the best way to accomplish this is to install it globally on your system as Lerna does not currently recognize the distinction between production and development dependencies. However, installing service-level devDependencies is totally fine, though there's not much point._ 

### Modules - `index.js` 

Each module consists of at least a function handler within the `index.js` file. An example is provided. Modules may consist of other files/modules, but they should at least include `index.handler.` While it is possible to change the name of the handler function, it is not recommended for consistency. 

As in the example, it may be useful to separate the handler function into at least two functions - a `handler` function, to process the incoming event and attach metadata to it, and a `response` function to actually generate a function response. 

Of course, many more functions can be included, however, be careful of scope creep.  As mentioned in the `readme.md`, each function has a distinct responsibility and should ideally only handle that one particular action. This is more of an art than a science, but more information on how to do this well will be added to this document in the future.

### Test - `index.spec.js` 

Each function should have at least one test to test the handler module, which will be ran on the individual function with `npm test` prior to deployment. It's generally recommended to use Mocha, and we generally prefer the Chai `assert` assertion style. Rather than using, for instance, `sls invoke`, there should be a test that takes a sample event (you can find sample events in the AWS Lambda Console) and checks that the output from the input event object is as expected. It may be useful to put these JSON objects in a `test/` folder.

Generally, we recommend having both an `npm test` and a `npm test:watch` script in the function-level package manifest. An example is already provided in this repository. The `npm test` command provides non-interactive tests, while the `watch` command watches `index.spec.js` and `index.js` and runs your tests on every save. This way you can simply change your working directory to the function and interactively run your tests alongside your code.

Of course, if your code is larger than one module you will need to add tests for the other modules as well, and update the `package.json` scripts accordingly. Note that, as mentioned above, you will need `nodemon` and `mocha` installed globally for this to work as Lerna does not respect development dependencies and these tools should not be included in production builds. Alternatively, you can use Lerna commands in the service root to scope out and run the `npm test` command on the particular function you're working on.

### Configuration - `config.js`
Another useful common file is a `config.js` - this is for bootstrapping configuration values. Configuration management will be discussed in more detail in a later part of this document, but generally secrets should not be stored in environmental variables (even though the Serverless Framework lets you do this). 

It's also a useful repository of constants and run-time flags. Rather than setting a constant in the code, it should probably be set in the `config.js` file.

### Documentation - `readme.md`
Finally, each function should include a `readme.md`. This can be either used for HTTP testing or as a place to outline general function spec. Of course, in-line comments are also useful for this. 

### Cloudformation Resources - `resources.yaml`
Some functions consist of a `resources.yaml` - these resources are imported manually into the service-wide global `serverless.yaml` to configure function-specific resources (for instance, IAM permissions - generally, a function should only have permissions to touch the things it needs to touch.) 
