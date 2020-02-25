const { Router } = require('express');
const { check } = require('express-validator');
const managerController = require('../controllers/auth.controller');

const router = Router();

router.post(
  '/register',
  [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password should be at list 6 characters').isLength({ min: 6 }),
    check('firstName', 'Name required').exists(),
    check('lastName', 'Secondname required').exists(),
  ],
  managerController.register,
);

router.post(
  '/login',
  [
    check('email', 'Please input valid email').normalizeEmail().isEmail(),
    check('password', 'Please input your password').exists(),
  ],
  managerController.login,
);


module.exports = router;
