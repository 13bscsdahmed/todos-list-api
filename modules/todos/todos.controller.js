const winston = require('../../config/winston');
const constants = require('../../config/constants');
const todosHelper = require('./todos.helper');
const { responseMessages } = require('./todos.constants');


module.exports = {
  /**
   * Controller function to login todos
   * @param req
   * @param res
   * @param next
   */
  userLogin(req, res, next) {
    const user = req.body;
    winston.debug(`ReqId: [${req.reqId}] Processing login request for user ${user.email}`);
    todosHelper.loginUser(user, req.reqId).then((token) => {
      res.json({
        success: 1,
        message: responseMessages.login.success,
        data: {},
      });
    }).catch((error) => {
      next(error);
    });
  },
};
