const glob = require('glob');
const winston = require('./winston');
const constants = require('./constants');

module.exports = (app) => {
  winston.info('Loading routes');
  const routePath = 'modules/**/*.routes.js';
  const version = `/api/${constants.apiVersion}`;
  glob.sync(routePath).forEach((file) => {
    require(`../${file}`)(app, version);
    winston.info(`'${file}' is loaded`);
  });
};
