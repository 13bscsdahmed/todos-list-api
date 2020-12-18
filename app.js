const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const uuid = require('uuid/v4');
const winston = require('./config/winston');
const constants = require('./config/constants');

// Configuring the environment
require('dotenv').config({
  path: '.env',
});

const app = express();

const port = process.env.PORT || 3000;

function shutdown() {
  winston.info('Shutting down server');
  process.exit(1);
}
// Configure routes and error handling
require('./config/config')((err) => {
  if (err) {
    winston.error(`An error occurred while configuring app: ${err}. Shutting down server.`);
    process.exit(1);
  } else {
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // CORS middleware
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
      res.setHeader('Access-Control-Expose-Headers', constants.tokenHeaderKey);
      next();
    });

    // CORS middleware for handling options request
    app.use((req, res, next) => {
      if (req.method === 'OPTIONS') {
        const headers = {};
        headers['Access-Control-Allow-Origin'] = '*';
        headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS';
        headers['Access-Control-Allow-Headers'] = `Content-Type, ${constants.tokenHeaderKey}`;
        headers['Access-Control-Expose-Headers'] = constants.tokenHeaderKey;
        res.writeHead(200, headers);
        res.end();
      } else {
        next();
      }
    });

    // Configuring the request to append a unique id.
    app.use((req, res, next) => {
      req.reqId = uuid();
      next();
    });

    const passport = require('./config/passport');
    app.use(passport.initialize());

    require('./config/express')(app);

    const onError = (error) => {
      switch (error.code) {
        case 'EACCES':
          winston.error(`Port '${port}' requires elevated privileges`);
          break;
        case 'EADDRINUSE':
          winston.error(`Port '${port}' is already in use`);
          break;
        default:
          winston.error(`An error occurred while starting server: ${error}`);
      }
      shutdown();
    };

    const onListening = () => {
      winston.info(`Server started on port: '${port}'`);
    };
    // Creating server
    const server = http.createServer(app);
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  }
});
