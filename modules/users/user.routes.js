const userController = require('./user.controller');
const errorMiddleware = require('../common/error-middleware');
const userMiddleware = require('./user.middleware');

const resource = '/user';

module.exports = (app, version) => {
  app.post(
    `${version}${resource}/login`,
    userMiddleware.validateLoginParameters,
    errorMiddleware,
    userController.userLogin,
  );

  app.post(
    `${version}${resource}/signup`,
    userMiddleware.validateSignupParameters,
    errorMiddleware,
    userController.createUser,
  );
};
