const winston = require('../../config/winston');
const constants = require('../../config/constants');
const userHelper = require('./user.helper');
const { responseMessages } = require('./user.constants');


module.exports = {
  /**
   * Controller function to login users
   * @param req
   * @param res
   * @param next
   */
  userLogin(req, res, next) {
    const user = req.body;
    winston.debug(`ReqId: [${req.reqId}] Processing login request for user ${user.email}`);
    userHelper.loginUser(user, req.reqId).then((token) => {
      res.setHeader(constants.tokenHeaderKey, token);
      res.json({
        success: 1,
        message: responseMessages.login.success,
        data: {},
      });
    }).catch((error) => {
      next(error);
    });
  },
  /**
   * Controller function to create/signup users
   * @param req
   * @param res
   * @param next
   */
  createUser(req, res, next) {
    const user = req.body;
    winston.debug(`ReqId: [${req.reqId}] Processing sign up for user ${user.email}`);
    userHelper.signupUser(user, req.reqId).then(() => {
      winston.info(`ReqId: [${req.reqId}] Successfully signed up user ${user.email}`);
      res.json({
        success: 1,
        message: responseMessages.signUp.success,
        data: {},
      });
    }).catch((error) => {
      next(error);
    });
  },
};
