const fs = require('fs');

// Common utility functions that can be used by all modules.
module.exports = {
  /**
   * Function to test validation rules of email
   * @param {String} email - The email to validate
   * @returns {boolean}
   */
  passwordValidator(password) {
    return (password.length >= 8) && (/\d/.test(password));
  },
  /**
   * Creates a file with the provided name and writes the provided data in it.
   * @param {String} dirPath The path to the file including the filename.
   * @param {String} data The data that is to be written to the file.
   * @returns {Promise}
   */
  emailValidator(email) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
  },
  /**
   * Function to get date in yyyy-mm-dd of last n days
   * @param {number} [numberOfDays] - Number of days
   * @returns {string}
   */
  getLastDaysDate(numberOfDays) {
    const result = [];
    for (let i = 0; i < numberOfDays; i += 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      result.push(d.toISOString().split('T')[0]);
    }
    return result;
  },
  /**
   * Function to get date in yyyy-mm-dd format from unix timestamp
   * @param timestamp
   */
  getDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },
  /**
   * Checks and creates a new directory if it does not already exist and returns a promise.
   * @param {String} dirPath The path of the directory that is to be created.
   * @returns {Promise}
   */
  createDirectory(dirPath) {
    return new Promise((resolve, reject) => {
      // Check if the folder already exists.
      fs.access(dirPath, fs.constants.F_OK, (err) => {
        if (err && err.code === 'EEXIST') { // If directory already exists.
          return resolve();
        }
        if (err && err.code !== 'ENOENT') { // If there is some error other then directory does not exist.
          return reject();
        }
        // Create the new folder.
        return fs.mkdir(dirPath, (error) => {
          if (error && error.code !== 'EEXIST') {
            return reject(error);
          }
          return resolve();
        });
      });
    });
  },
};
