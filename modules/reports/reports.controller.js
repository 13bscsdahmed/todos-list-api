const reportsHelper = require('./reports.helper');
const { responseMessages } = require('./reports.constants');


module.exports = {
  /**
   * Controller function to fetch tasks completed per day reports
   * @param req
   * @param res
   * @param next
   */
  fetchTaskCompletedPerDayReport(req, res, next) {
    reportsHelper.fetchTaskCompletedPerDayReport(req.reqId).then((report) => {
      res.status(201);
      res.json({
        success: 1,
        message: responseMessages.reportFetched.success,
        data: report,
      });
    }).catch((error) => {
      next(error);
    });
  },
};
