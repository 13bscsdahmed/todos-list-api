const { check } = require('express-validator/check');
const common = require('../common/common');

module.exports = {
  validateLoginParameters: [
    check('email', '1002').exists(),
    check('email', '1003').custom(common.emailValidator),
    check('password', '1003').exists(),
    check('password', '1005').custom(common.passwordValidator),
  ],
  validateSignupParameters: [
    check('email', '1002').exists(),
    check('email', '1003').custom(common.emailValidator),
    check('password', '1004').exists(),
    check('password', '1005').custom(common.passwordValidator),
    check('name', '1006').exists(),
  ],
};
