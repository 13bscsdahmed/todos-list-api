const listsHelper = require('./lists.helper');
const { responseMessages } = require('./lists.constants');


module.exports = {
  /**
   * Controller function to add list
   * @param req
   * @param res
   * @param next
   */
  addList(req, res, next) {
    const list = req.body;
    listsHelper.addList(list, req.reqId).then((addedList) => {
      res.status(201);
      res.json({
        success: 1,
        message: responseMessages.listAdded.success,
        data: addedList,
      });
    }).catch((error) => {
      next(error);
    });
  },
  /**
   * Controller function to get all lists
   * @param req
   * @param res
   * @param next
   */
  getAllLists(req, res, next) {
    listsHelper.getAllLists(req.reqId).then((lists) => {
      res.json({
        success: 1,
        message: responseMessages.listsFetched.success,
        data: lists,
      });
    }).catch((error) => {
      next(error);
    });
  },
};
