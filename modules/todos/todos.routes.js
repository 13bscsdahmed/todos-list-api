const todosController = require('./todos.controller');
const errorMiddleware = require('../common/error-middleware');
const todosMiddleware = require('./todos.middleware');

const resource = '/user';

module.exports = (app, version) => {
  app.post(
    `${version}${resource}/login`,
    todosMiddleware.validateLoginParameters,
    errorMiddleware,
    todosController.userLogin,
  );
};
