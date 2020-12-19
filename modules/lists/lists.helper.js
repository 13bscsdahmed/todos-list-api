const winston = require('../../config/winston');

const FlatDB = require('flat-db');


const Lists = new FlatDB.Collection('lists');


/**
 * Helper function to add list
 * @param {Object} [list] - list object
 * @param {string} [reqId] - request id
 */
const addList = (list, reqId) => {
  winston.debug(`ReqId: [${reqId}] addList() method starts`);
  return new Promise((resolve, reject) => {
    const key = Lists.add({
      description: 'X-Men',
    });
    const addedList = Lists.get(key);
    resolve(addedList);
  });
};

/**
 * Helper function to get lists
 * @param {string} [reqId] - request id
 */
const getAllLists = (reqId) => {
  winston.debug(`ReqId: [${reqId}] getAllLists() method starts`);
  return new Promise((resolve, reject) => {
    const lists = Lists.all();
    resolve(lists);
  });
};

module.exports = {
  addList,
  getAllLists,
};
