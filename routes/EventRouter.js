const express = require('express');
const eventController = require('../controllers/eventController');

function eventRouter(Event) {
  const EvRouter = express.Router();
  const evController = eventController(Event);
  EvRouter.route('/logs')
    .post(evController.createLog) // create new log
    .get(evController.lsLog); // log list
  EvRouter.route('/logs/date')
    .get(evController.date); // log list in particular time period

  EvRouter.route('/logs/?userid=identifier')
    .get(evController.getLogsByUserId); // log list based on userID
  EvRouter.route('/logs/:logid')
    .get(evController.showOneLog) // Particular log
    .put(evController.editLog) // Update log
    .delete(evController.deleteLog); // Delete log
  return EvRouter;
}

module.exports = eventRouter;
