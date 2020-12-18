const glob = require('glob');
const path = require('path');
const mongoose = require('mongoose');
const async = require('async');
const uuid = require('uuid/v4');
const winston = require('./winston');

module.exports = (callback) => {
  async.series(
    [
      (envCb) => {
        // Checking required environment variables
        if (!process.env.MONGO_DB_ADDRESS || !process.env.MONGO_DB_NAME) {
          winston.error('Missing MongoDB credentials in env file.\n Shutting down server.');
          process.exit(1);
        }
        const dbUrl = `mongodb://${process.env.MONGO_DB_ADDRESS}/${process.env.MONGO_DB_NAME}`;
        // Connecting to Database
        mongoose.connect(dbUrl, {
          autoReconnect: true,
          useNewUrlParser: true,
          useFindAndModify: true,
          useCreateIndex: true,
        });
        // when successfully connected
        mongoose.connection.on('connected', () => {
          winston.info(`Mongoose connection open to '${dbUrl}'`);
          envCb();
        });
        // if the connection throws an error
        mongoose.connection.on('error', (err) => {
          envCb(err);
        });
        // when the connection is disconnected
        mongoose.connection.on('disconnected', () => {
          winston.error('Mongoose connection disconnected');
        });
      },
      (modelsCb) => {
      // load all models
        glob('modules/**/*.model.js', (err, files) => {
          if (err) {
            modelsCb(err);
          } else {
            winston.info('Loading models');
            files.forEach((file) => {
              require(path.join(__dirname, '../', file));
              winston.info(`'${file}' is loaded`);
            });
            modelsCb();
          }
        });
      },
      (keysCb) => {
        // Load or create Session Key
        const secretSchema = new mongoose.Schema({
          session_secret: { type: String, required: true },
        });
        const Secret = mongoose.model('Secret', secretSchema);
        // Fetching secret from db.
        Secret.findOne({}).then((secret) => {
          if (!secret) {
            // Generating and saving new secret
            const secretString = uuid();
            const sessionSecret = new Secret({
              session_secret: secretString,
            });
            sessionSecret.save().then(() => {
              process.env.SESSION_SECRET = secretString;
              keysCb();
            });
          } else {
            process.env.SESSION_SECRET = secret.session_secret;
            keysCb();
          }
        });
      }],
    (err) => {
      if (err) {
        return callback(err);
      }
      return callback();
    },
  );
};
