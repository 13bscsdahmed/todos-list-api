const glob = require('glob');
const winston = require('./winston');

winston.info('Loading error messages');
const routePath = 'modules/**/*.errors.json';
let errorObject = {
  '0001': {
    msg: 'User id not available in provided token.',
  },
  '0002': {
    msg: 'No user found with the provided id',
  },
  '0003': {
    msg: 'User is not authenticated.',
  },
  '0004': {
    msg: 'User is not authorized to visit this api.',
  },
};

glob.sync(routePath).forEach((file) => {
  errorObject = {
    ...errorObject,
    ...require(`../${file}`),
  };
  winston.info(`'${file}' is loaded`);
});

module.exports = errorObject;
