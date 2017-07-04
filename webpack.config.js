
const projectConfig = require("./project.config");

switch (process.env.NODE_ENV) {
  case projectConfig.Environments.PRODUCTION:
    module.exports = require('./webpack/prod.config')({env: 'production'});
    break;
  case projectConfig.Environments.TEST:
    module.exports = require('./webpack/test.config')({env: 'test'});
    break;
  case projectConfig.Environments.DEVELOPMENT:
  default:
    module.exports = require('./webpack/dev.config')({env: 'development'});
}