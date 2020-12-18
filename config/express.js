const winston = require('./winston');
const errorCodes = require('./errors');
const swaggerDocument = require('../swagger.json');
const swaggerUi = require('swagger-ui-express');

module.exports = (app) => {
  require('./routes')(app);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.get('/*', (req, res) => {
    res.status(404);
    res.json({
      success: 0,
      message: 'Not Found',
      response: 404,
      data: {},
    });
  });

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    // If the error is a stack error log it's stack
    if (err instanceof Error) {
      winston.error(`ReqId: ${req.reqId} An error occurred in processing the API call: ${err.stack}`);
    } else { // Else log the object or string
      winston.error(`ReqId: ${req.reqId} An error occurred in processing the API call: ${typeof err === 'object' ? JSON.stringify(err) : err}`);
    }

    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).map(key => ({
        message: errorCodes[err.errors[key]].msg,
        code: err.errors[key],
        parameter: key,
      }));
      res.json({
        success: 0,
        message: 'Errors encountered while validating request parameters.',
        data: {},
        errors,
      });
    } else if (err.status === 404) {
      let message = 'Not Found';
      if (err.msgCode) {
        message = errorCodes[err.msgCode].msg;
      }
      res.json({
        success: 0,
        message,
        data: {},
      });
    } else if (err.msgCode) {
      const data = err.data || {};
      res.json({
        success: 0,
        message: errorCodes[err.msgCode].msg,
        data,
      });
    } else if (err.message) {
      const data = err.data || {};
      res.json({
        success: 0,
        message: err.message,
        data,
      });
    } else {
      res.json({
        success: 0,
        message: 'Something went wrong. Please try again.',
        data: {},
      });
    }
  });
};
