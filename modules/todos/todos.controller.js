const winston = require('../../config/winston');
const constants = require('../../config/constants');
const todosHelper = require('./todos.helper');
const { responseMessages } = require('./todos.constants');


module.exports = {
  /**
   * Controller function to add todos
   * @param req
   * @param res
   * @param next
   */
  addTodo(req, res, next) {
    const todo = req.body;
    todosHelper.addTodo(todo, req.reqId).then((addedTodo) => {
      winston.info(`ReqId: [${req.reqId}] Successfully added todo`);
      res.status(201);
      res.json({
        success: 1,
        message: responseMessages.todoAdded.success,
        data: addedTodo,
      });
    }).catch((error) => {
      winston.error(`ReqId: [${req.reqId}] An error occurred adding todo. Error: ${JSON.stringify(error)}`);
      next(error);
    });
  },
  /**
   * Controller function to edit todos
   * @param req
   * @param res
   * @param next
   */
  updateTodo(req, res, next) {
    const todo = req.body;
    const { todoId } = req.params;
    todosHelper.updateTodo(todoId, todo, req.reqId).then((updatedTodo) => {
      winston.info(`ReqId: [${req.reqId}] Successfully updated todo with id: ${todoId}`);
      res.json({
        success: 1,
        message: responseMessages.todoUpdated.success,
        data: updatedTodo,
      });
    }).catch((error) => {
      winston.error(`ReqId: [${req.reqId}] An error occurred updating todo with id: ${todoId}. Error: ${JSON.stringify(error)}`);
      next(error);
    });
  },
  /**
   * Controller function to delete todo
   * @param req
   * @param res
   * @param next
   */
  deleteTodo(req, res, next) {
    const { todoId } = req.params;
    todosHelper.deleteTodo(todoId, req.reqId).then(() => {
      winston.info(`ReqId: [${req.reqId}] Successfully deleted todo with id: ${todoId}`);
      res.json({
        success: 1,
        message: responseMessages.todoDeleted.success,
        data: {},
      });
    }).catch((error) => {
      winston.error(`ReqId: [${req.reqId}] An error occurred deleting todo with id: ${todoId}. Error: ${JSON.stringify(error)}`);
      next(error);
    });
  },
  /**
   * Controller function to get all todos
   * @param req
   * @param res
   * @param next
   */
  getAllTodos(req, res, next) {
    todosHelper.getAllTodos(req.reqId).then((todos) => {
      winston.info(`ReqId: [${req.reqId}] Successfully fetched all todos`);
      res.json({
        success: 1,
        message: responseMessages.todosFetched.success,
        data: todos,
      });
    }).catch((error) => {
      next(error);
    });
  },
  /**
   * Controller function to upload attachment
   * @param req
   * @param res
   * @param next
   */
  uploadAttachment(req, res, next) {
    const { todoId } = req.params;
    console.log(req.file);
    todosHelper.uploadAttachment(todoId, req.file.filename, req.reqId).then((updatedTodo) => {
      winston.info(`ReqId: [${req.reqId}] Successfully uploaded attachment of todo with id: ${todoId}`);
      res.json({
        success: 1,
        message: responseMessages.attachmentUploaded.success,
        data: updatedTodo,
      });
    }).catch((error) => {
      winston.error(`ReqId: [${req.reqId}] An error occurred uploaded attachment of todo with id: ${todoId}. Error: ${JSON.stringify(error)}`);
      next(error);
    });
  },
};
