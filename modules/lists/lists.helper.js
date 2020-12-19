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

module.exports = {
  addList,
  getAllLists,
};
