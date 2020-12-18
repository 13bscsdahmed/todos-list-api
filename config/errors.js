const glob = require('glob');
const winston = require('./winston');

winston.info('Loading error messages');
const routePath = 'modules/**/*.errors.json';
let errorObject = {
};

glob.sync(routePath).forEach((file) => {
  errorObject = {
    ...errorObject,
    ...require(`../${file}`),
  };
  winston.info(`'${file}' is loaded`);
});

module.exports = errorObject;
