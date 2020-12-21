const todosController = require('./todos.controller');
const errorMiddleware = require('../common/error-middleware');
const todosMiddleware = require('./todos.middleware');
const multer = require('multer');
const constants = require('../../config/constants');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `${constants.paths.staticAssetsDirectory}/`);
  },
  filename(req, file, cb) {
    cb(null, `${req.reqId}.${file.originalname.split('.').pop()}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    // accept file
    cb(null, true);
  } else {
    cb(new Error('Only png, jpg or jpeg files are accepted'), true);
  }
};
const upload = multer({
  storage,
  fileFilter,
});

const resource = '/todos';

module.exports = (app, version) => {
  app.post(
    `${version}${resource}`,
    todosMiddleware.validateAddTodoParameters,
    errorMiddleware,
    todosController.addTodo,
  );
  app.put(
    `${version}${resource}/:todoId`,
    todosMiddleware.validateUpdateTodoParameters,
    errorMiddleware,
    todosController.updateTodo,
  );
  app.delete(
    `${version}${resource}/:todoId`,
    todosController.deleteTodo,
  );
  app.get(
    `${version}${resource}`,
    todosController.getAllTodos,
  );
  app.post(
    `${version}${resource}/:todoId/attachments`,
    upload.single('file'),
    todosController.uploadAttachment,
  );
};
