const { check } = require('express-validator/check');

module.exports = {
  validateAddTodoParameters: [
    check('listId', '0001').exists(),
    check('title', '0001').exists(),
    check('description', '0001').exists(),
    check('dueDateTime', '1003').exists(),
  ],
  validateUpdateTodoParameters: [
    check('attachments', '0002').optional().isArray(),
  ],
};
