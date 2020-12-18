const async = require('async');
const winston = require('../../config/winston');


/**
 * Helper function to login user
 * @param {Object} [user] - user object
 * @param {string} [reqId] - request id
 */
const loginUser = (user, reqId) => {
  winston.debug(`ReqId: [${reqId}] userLogin() method starts for user: ${user.email}`);
  let token;
  return new Promise((resolve, reject) => {
    async.waterfall([
      (fetchUser) => {
      },
    ], (error) => {
      if (!error) {
        resolve(token);
      } else {
        reject(error);
      }
    });
  });
};

module.exports = {
  loginUser,
};
