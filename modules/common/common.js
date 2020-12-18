const fs = require('fs');
const winston = require('../../config/winston');
const bcrypt = require('bcrypt');
const constants = require('../../config/constants');

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
   * Function to generate hash of string
   * @param string: string to hash
   * @param rounds: Number of rounds for salting
   */
  generateHash(string, rounds) {
    return new Promise((resolve, reject) => {
      // generate a salt
      bcrypt.genSalt(rounds, (err, salt) => {
        if (err) {
          return reject(err);
        }
        // hash the password using our new salt
        return bcrypt.hash(string, salt, (error, hash) => {
          if (error) {
            return reject(error);
          }

          return resolve(hash);
        });
      });
    });
  },
};
