const { Router } = require('express');
const { check } = require('express-validator');
const managerController = require('../controllers/manager.controller');
const userController = require('../controllers/user.controller');

const auth = require('../mddleware/auth.middleware');

const router = Router();

router.post(
  '/register',
  [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password should be at list 6 characters').isLength({ min: 6 }),
    check('firstName', 'Name required').exists(),
    check('lastName', 'Secondname required').exists(),
  ],
  managerController.createManager,
);

router.post(
  '/login',
  [
    check('email', 'Please input valid email').normalizeEmail().isEmail(),
    check('password', 'Please input your password').exists(),
  ],
  managerController.authManager,
);

router.post(
  '/users/:userId',
  [
    check('email', 'Please input valid email').normalizeEmail().isEmail(),
    check('firstName').exists(),
    check('lastName').exists(),
  ],
  auth,
  userController.updateUser,
);

router.post(
  '/createUser',
  [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password should be at list 6 characters').isLength({ min: 6 }),
    check('firstName', 'Name required').exists(),
    check('lastName', 'Secondname required').exists(),
  ],
  auth,
  userController.createUser,
);

router.get('/users', auth, userController.showUsers);

router.get('/users/:userId', auth, userController.showOneUser);

router.delete('/users/:userId', auth, userController.deleteUser);

module.exports = router;
