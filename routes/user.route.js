const { Router } = require('express');
const { check } = require('express-validator');
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
	userController.createUser,
);

router.post(
	'/login',
	[
		check('email', 'Please input valid email').normalizeEmail().isEmail(),
		check('password', 'Please input your password').exists(),
	],
	userController.authUser,
);

router.get('/users', auth, userController.showUsers);

router.get('/users/:userId', auth, userController.showOneUser);

router.delete('/users/:userId', auth, userController.deleteUser);

module.exports = router;
