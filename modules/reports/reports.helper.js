const winston = require('../../config/winston');
const constants = require('../../config/constants');
const common = require('../common/common');
const FlatDB = require('flat-db');


const TasksCompletedPerDayReports = new FlatDB.Collection('taskcompletedperdayReport');
const Todos = new FlatDB.Collection('todos');

/**
 * Function generates task completed per day report
 * @param {number} [currentTimestamp] - Current timestamp
 * @param {Array} [todos] - Array of completed todos
 */
const generateTaskCompletedPerDayReport = (currentTimestamp, todos) => {
  winston.debug('Generating new report for number of tasks completed per day');
  const dates = common.getLastDaysDate(7);
  const reportToGenerate = [];
  dates.forEach((date) => {
    reportToGenerate.push({
      date,
      total: 0,
      updatedDateTime: currentTimestamp,
    });
  });
  todos.forEach((todo) => {
    if (currentTimestamp - todo.completionDateTime < 604800000) { // Filter todos completed in last 7 days
      const date = common.getDateFromTimestamp(todo.completionDateTime);
      for (let i = 0; i < reportToGenerate.length; i += 1) {
        if (reportToGenerate[i].date === date) {
          reportToGenerate[i].total += 1;
        }
      }
    }
  });

  // Create new report
  reportToGenerate.forEach((item) => {
    TasksCompletedPerDayReports.add({
      date: item.date,
      total: item.total,
      updatedDateTime: item.updatedDateTime,
    });
  });
};

/**
 * Helper function to add list
 * @param {Object} [list] - list object
 * @param {string} [reqId] - request id
 */
const fetchTaskCompletedPerDayReport = (reqId) => {
  winston.debug(`ReqId: [${reqId}] fetchTaskCompletedPerDayReport() method starts`);
  const currentDate = Date.now();
  let reportGenerationTime;
  let generateReport = true;
  // eslint-disable-next-line consistent-return
  return new Promise((resolve, reject) => {
    try {
      const report = TasksCompletedPerDayReports.all();
      if (report && report.length > 0) {
        reportGenerationTime = report[0].updatedDateTime;
        if (currentDate - reportGenerationTime < constants.reportExpiryTime) {
          generateReport = false;
          return resolve(report);
        }
      }
      if (generateReport) {
        // Clear exisiting report only if it existed
        if (report && report.length > 0) {
          TasksCompletedPerDayReports.reset();
        }
        // Find all completed todos
        const todos = Todos.find().equals('completionStatus', true).run();
        generateTaskCompletedPerDayReport(currentDate, todos);
        return resolve(TasksCompletedPerDayReports.all());
      }
    } catch (err) {
      winston.error(`ReqId: [${reqId}] An error occurred fetching report. Error: ${err}`);
      return reject({ msgCode: '3001', status: 500 });
    }
  });
};

module.exports = {
  fetchTaskCompletedPerDayReport,
};
