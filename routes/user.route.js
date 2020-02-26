const { Router } = require('express');
const { check } = require('express-validator');
const auth = require('../mddleware/auth.middleware');

const router = Router();
const userController = require('../controllers/user.controller');


router.post(
  '/createUser',
  [
    check('userid', 'Please input userID').exists(),
    check('eventDescription', 'Log must contain eventDescription').exists(),
  ],
  auth,
  userController.createUser,
);

router.put(
  '/users/:userId',
  [
    check('firstName', 'Please input first name').isString().exists(),
    check('lastName', 'Please input first name').isString().exists(),
    check('email').isEmail().exists(),
  ],
  auth,
  userController.updateUser,
);


router.get('/users/all', auth, userController.showUsers);

router.get('/users/:userId', auth, userController.showOneUser);

router.delete('/users/:userId', auth, userController.deleteUser);


module.exports = router;
