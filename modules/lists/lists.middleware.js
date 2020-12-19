const { check } = require('express-validator/check');

module.exports = {
  validateAddListParameters: [
    check('title', '0001').exists(),
  ],
};
