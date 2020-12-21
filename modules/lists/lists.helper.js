const winston = require('../../config/winston');

const FlatDB = require('flat-db');


const Lists = new FlatDB.Collection('lists');
const Todos = new FlatDB.Collection('todos');


/**
 * Helper function to add list
 * @param {Object} [list] - list object
 * @param {string} [reqId] - request id
 */
const addList = (list, reqId) => {
  winston.debug(`ReqId: [${reqId}] addList() method starts`);
  return new Promise((resolve, reject) => {
    try {
      const key = Lists.add({
        title: list.title,
      });
      const addedList = Lists.get(key);
      resolve(addedList);
    } catch (err) {
      winston.error(`ReqId: [${reqId}] An error occurred adding list. Error: ${JSON.stringify(err)}`);
      reject({ msgCode: '2002', status: 500 });
    }
  });
};

/**
 * Helper function to get lists
 * @param {string} [reqId] - request id
 */
const getAllLists = (reqId) => {
  winston.debug(`ReqId: [${reqId}] getAllLists() method starts`);
  return new Promise((resolve, reject) => {
    try {
      const lists = Lists.all();
      resolve(lists);
    } catch (err) {
      winston.error(`ReqId: [${reqId}] An error occurred fetching lists. Error: ${JSON.stringify(err)}`);
      reject({ msgCode: '2001', status: 500 });
    }
  });
};

/**
 * Helper function to delete list
 * @param {string} [listId] - list id
 * @param {string} [reqId] - request id
 */
const deleteList = (listId, reqId) => {
  winston.debug(`ReqId: [${reqId}] deleteList() method starts for list with id: ${listId}`);
  return new Promise((resolve, reject) => {
    try {
      const removed = Lists.remove(listId);
      const listTodosToDelete = Todos.find().equals('listId', listId).run();
      if (removed) {
        if (listTodosToDelete && listTodosToDelete.length > 0) {
          listTodosToDelete.forEach((todoToDelete) => {
            Todos.remove(todoToDelete._id_);
          });
          resolve();
        } else {
          resolve();
        }
      } else {
        reject({ msgCode: '2004', status: 404 });
      }
    } catch (err) {
      winston.error(`ReqId: [${reqId}] An error occurred deleting list. Error: ${JSON.stringify(err)}`);
      reject({ msgCode: '2003', status: 500 });
    }
  });
};

module.exports = {
  addList,
  getAllLists,
  deleteList,
};
