const { Router } = require('express');
const { check } = require('express-validator');
const auth = require('../mddleware/auth.middleware');

const router = Router();
const eventController = require('../controllers/event.controller');

router.post(
  '/createLog',
  [
    check('userid', 'Please input userID').exists(),
    check('eventDescription', 'Log must contain eventDescription').isString().exists(),
  ],
  auth,
  eventController.createLog,
);

router.get('/logs/all', auth, eventController.showLogs);

router.post('/logs/date', auth, eventController.showLogsByDate);

router.get('/logs/:userId', auth, eventController.showLogsByUserId);

router.put(
  '/logs/:logId',
  [
    check('eventDesctiption').exists().isString(),
  ],
  auth,
  eventController.updateLog,
);

/* todo
router.get('/logs/all', auth, eventController.showLogs);
router.post('/logs/date', auth, eventController.showLogsByDate);
*/
module.exports = router;
