const express = require('express');
const eventController = require('../controllers/eventController');

function eventRouter(Event) {
  const EvRouter = express.Router();
  const evController = eventController(Event);
  EvRouter.route('/logs')
    .post(evController.createLog)
    .get(evController.lsLog);
  EvRouter.route('/logs/date')
    .get(evController.date);

  EvRouter.route('/logs/?userid=identifier')
    .get(evController.getLogsByUserId);
  EvRouter.route('/logs/:logid')
    .get(evController.showOneLog)
    .put(evController.editLog)
    .delete(evController.deleteLog);
  return EvRouter;
}

module.exports = eventRouter;
