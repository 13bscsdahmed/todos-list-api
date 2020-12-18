const async = require('async');
const mongoose = require('mongoose');
const winston = require('../../config/winston');
const { sign } = require('jsonwebtoken');
const constants = require('../../config/constants');
const common = require('../common/common');

const User = mongoose.model('User');

/**
 * helper function to generate token on user logged in
 * @param {Object} [user] - user object
 * @returns {Object}
 */
const generateLoginToken = user => sign({
  _id: user._id,
  email: user.email,
  name: user.name,
  userType: user.userType,
  isDeleted: user.isDeleted,
  signUpDate: user.signUpDate,
}, process.env.SESSION_SECRET, { expiresIn: constants.tokenExpiryTime });

/**
 * helper function to check if the provided password matches the user password
 * @param {Object} [user] - user object
 * @param {String} [password] - password to match
 * @returns {Object}
 */
const isPasswordMatch = async (user, password) => new Promise((resolve, reject) => {
  user.comparePassword(password, (err, isMatch) => {
    if (err) {
      return reject(err);
    }

    return resolve(isMatch);
  });
});

/**
 * Helper function to construct user object to be saved in database
 * @param {Object} [user] - user object
 */
const constructUserObject = user => new Promise((resolve, reject) => {
  common.generateHash(String(new Date().getTime()) + user.email, 10).then((hash) => {
    const userObject = new User({
      name: user.name,
      email: user.email,
      password: user.password,
    });
    resolve(userObject);
  }).catch((error) => {
    reject(error);
  });
});

/**
 * Helper function to login user
 * @param {Object} [user] - user object
 * @param {string} [reqId] - request id
 */
const loginUser = (user, reqId) => {
  winston.debug(`ReqId: [${reqId}] userLogin() method starts for user: ${user.email}`);
  let userObject;
  let token;
  return new Promise((resolve, reject) => {
    async.waterfall([
      (fetchUser) => {
        User.findOne({ email: user.email }).then((foundUser) => {
          if (!foundUser) {
            winston.info(`ReqId: [${reqId}] No user found with the email ${user.email}`);
            fetchUser({ msgCode: '1011', status: 401 });
          } else {
            winston.info(`ReqId: [${reqId}] User found. Comparing provided password with the one in DB`);
            userObject = foundUser;
            fetchUser(null);
          }
        }).catch(() => {
          fetchUser({ msgCode: '1011', status: 500 });
        });
      },
      (comparePassword) => {
        isPasswordMatch(userObject, user.password).then((matchPassRes) => {
          if (!matchPassRes) {
            winston.info(`ReqId: [${reqId}] The provided user password did not match with the one in DB`);
            comparePassword({ msgCode: '1001', status: 401 });
          } else {
            winston.info(`User with id: [${userObject._id}] logged in successfully`);
            // User authenticated. Generate token and return.
            token = generateLoginToken(userObject);
            comparePassword(null);
          }
        }).catch((error) => {
          winston.error(`ReqId: [${reqId}] An error occurred while comparing user passwords. ${error}`);
          comparePassword({ msgCode: '1011', status: 500 });
        });
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

/**
 * Helper function to signup user
 * @param {Object} [user] - user object
 * @param {string} [reqId] - request id
 */
const signupUser = (user, reqId) => {
  winston.debug(`ReqId: [${reqId}] signupUser() method starts for user ${user.email}`);
  let userObject;
  return new Promise((resolve, reject) => {
    async.waterfall([
      (createUserObject) => {
        winston.debug(`ReqId: [${reqId}] Constructing object for user ${user.email}`);
        constructUserObject(user).then((userObj) => {
          userObject = userObj;
          createUserObject(null);
        }).catch((error) => {
          winston.error(`ReqId: [${reqId}] An error occurred constructing object for user ${user.email}. Error: ${error}`);
          createUserObject({ msgCode: '1009', status: 500 });
        });
      },
      (saveUserObject) => {
        winston.debug(`ReqId: [${reqId}] Saving object for user ${user.email}`);
        userObject.save().then(() => {
          winston.info(`ReqId: [${reqId}] Successfully saved object for user ${user.email}`);
          saveUserObject(null);
        }).catch((error) => {
          winston.error(`ReqId: [${reqId}] An error occurred saving object for user ${user.email}. Error: ${error}`);
          saveUserObject({ msgCode: '1010', status: 403 });
        });
      },
    ], (error) => {
      if (!error) {
        resolve();
      } else {
        reject(error);
      }
    });
  });
};

module.exports = {
  signupUser,
  loginUser,
};
