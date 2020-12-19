const todosController = require('./todos.controller');
const errorMiddleware = require('../common/error-middleware');
const todosMiddleware = require('./todos.middleware');

const resource = '/todos';

module.exports = (app, version) => {
  app.post(
    `${version}${resource}`,
    todosMiddleware.validateAddTodoParameters,
    errorMiddleware,
    todosController.addTodo,
  );
  app.put(
    `${version}${resource}/:todoId`,
    todosMiddleware.validateUpdateTodoParameters,
    errorMiddleware,
    todosController.updateTodo,
  );
  app.delete(
    `${version}${resource}/:todoId`,
    todosController.deleteTodo,
  );
  app.get(
    `${version}${resource}`,
    todosController.getAllTodos,
  );
};
