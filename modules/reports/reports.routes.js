const reportsController = require('./reports.controller');

const resource = '/reports';

module.exports = (app, version) => {
  app.get(
    `${version}${resource}/tasks-completed-per-day`,
    reportsController.fetchTaskCompletedPerDayReport,
  );
};
