const winston = require('../../config/winston');

const FlatDB = require('flat-db');


const Todos = new FlatDB.Collection('todos');
const Lists = new FlatDB.Collection('lists');

/**
 * Function to check if list with the given id exists
 * @param {string} [listId] - List id
 * @returns {boolean}
 */
const checkIfListExists = (listId) => {
  const list = Lists.get(listId);
  return !!list;
};

/**
 * Function to check if todo with the given id exists
 * @param {string} [todoId] - Todo id
 * @returns {boolean}
 */
const checkIfTodoExists = (todoId) => {
  const todo = Todos.get(todoId);
  return !!todo;
};

/**
 * Helper function to add todo
 * @param {Object} [todo] - todo object
 * @param {string} [reqId] - request id
 */
const addTodo = (todo, reqId) => {
  winston.debug(`ReqId: [${reqId}] addTodo() method starts for todo`);
  return new Promise((resolve, reject) => {
    try {
      if (checkIfListExists(todo.listId)) {
        const key = Todos.add({
          listId: todo.listId,
          title: todo.title,
          dueDateTime: todo.dueDateTime,
          description: todo.description,
          createDateTime: Date.now(),
          completionDateTime: 0,
          completionStatus: false,
          attachments: [],
        });
        const addedTodo = Todos.get(key);
        resolve(addedTodo);
      } else {
        reject({ msgCode: '1001', status: 404 });
      }
    } catch (err) {
      winston.error(`ReqId: [${reqId}] An error occurred adding todo. Error: ${JSON.stringify(err)}`);
      reject({ msgCode: '1003', status: 500 });
    }
  });
};

/**
 * Helper function to update todo
 * @param {string} [todoId] - Id of todo to update
 * @param {Object} [todo] - updated todo object
 * @param {string} [reqId] - request id
 */
const updateTodo = (todoId, todo, reqId) => {
  winston.debug(`ReqId: [${reqId}] updateTodo() method starts for todo with id: ${todoId}`);
  return new Promise((resolve, reject) => {
    try {
      const fetchedTodo = Todos.get(todoId);
      if (fetchedTodo) {
        const objtoUpdate = {};
        if (todo.listId) objtoUpdate.listId = todo.listId;
        if (todo.title) objtoUpdate.title = todo.title;
        if (todo.dueDateTime) objtoUpdate.dueDateTime = todo.dueDateTime;
        if (todo.description) objtoUpdate.description = todo.description;

        // Completion status has been updated
        if (todo.completionStatus !== fetchedTodo.completionStatus) {
          objtoUpdate.completionStatus = todo.completionStatus;
          if (todo.completionStatus) {
            objtoUpdate.completionDateTime = Date.now();
          } else {
            objtoUpdate.completionDateTime = 0;
          }
        }
        if (todo.attachments) objtoUpdate.attachments = todo.attachments;
        Todos.update(todoId, objtoUpdate);
        const updatedTodo = Todos.get(todoId);
        resolve(updatedTodo);
      } else {
        reject({ msgCode: '1002', status: 404 });
      }
    } catch (err) {
      winston.error(`ReqId: [${reqId}] An error occurred updating todo. Error: ${JSON.stringify(err)}`);
      reject({ msgCode: '1005', status: 500 });
    }
  });
};

/**
 * Helper function to delete todo
 * @param {string} [todoId] - todo id
 * @param {string} [reqId] - request id
 */
const deleteTodo = (todoId, reqId) => {
  winston.debug(`ReqId: [${reqId}] deleteTodo() method starts for todo with id: ${todoId}`);
  return new Promise((resolve, reject) => {
    try {
      const removed = Todos.remove(todoId);
      if (removed) {
        resolve();
      } else {
        reject({ msgCode: '1002', status: 404 });
      }
    } catch (err) {
      winston.error(`ReqId: [${reqId}] An error occurred deleting todo. Error: ${JSON.stringify(err)}`);
      reject({ msgCode: '1006', status: 500 });
    }
  });
};

/**
 * Helper function to get todos
 * @param {string} [reqId] - request id
 */
const getAllTodos = (reqId) => {
  winston.debug(`ReqId: [${reqId}] getAllTodos() method starts`);
  return new Promise((resolve, reject) => {
    try {
      const todos = Todos.all();
      resolve(todos);
    } catch (err) {
      winston.error(`ReqId: [${reqId}] An error occurred fetching todos. Error: ${JSON.stringify(err)}`);
      reject({ msgCode: '1004', status: 500 });
    }
  });
};

module.exports = {
  addTodo,
  updateTodo,
  deleteTodo,
  getAllTodos,
};
