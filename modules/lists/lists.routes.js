const listsController = require('./lists.controller');
const errorMiddleware = require('../common/error-middleware');
const listsMiddleware = require('./lists.middleware');

const resource = '/lists';

module.exports = (app, version) => {
  app.post(
    `${version}${resource}`,
    listsMiddleware.validateAddListParameters,
    errorMiddleware,
    listsController.addList,
  );
  app.get(
    `${version}${resource}`,
    listsController.getAllLists,
  );
};
