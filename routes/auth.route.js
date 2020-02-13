const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../mddleware/auth.middleware');

const router = Router();

const User = require('../models/userSchema');

router.post(
	'/register',
	[
		check('email', 'Invalid email').isEmail(),
		check('password', 'Password should be at list 6 characters').isLength({ min: 6 }),
		check('firstName', 'Name required').exists(),
		check('lastName', 'Secondname required').exists(),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.stats(400).json({
					errors: errors.array(),
					message: 'Invalid register data',
				});
			}

			const {
				email, password, firstName, lastName, lastActivity,
			} = req.body;

			const candidate = await User.findOne({ email });

			if (candidate) {
				return res.status(400).json({ message: 'User with simillar email already exists' });
			}

			const hashedPassword = await bcrypt.hash(password, 12);
			const user = new User({
				email, password: hashedPassword, firstName, lastName, lastActivity,
			});
			await user.save();

			return res.status(201).json({ message: 'User has been created' });
		} catch (e) {
			return res.status(500).json({ message: 'Internal server error, try again later' });
		}
	},
);

router.post(
	'/login',
	[
		check('email', 'Please input valid email').normalizeEmail().isEmail(),
		check('password', 'Please input your password').exists(),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.stats(400).json({
					errors: errors.array(),
					message: 'Invalid user data',
				});
			}
			const { email, password } = req.body;
			const user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({ message: 'User with this credentials doesn\'t exist' });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ message: 'Invalid email or password, try again' });
			}

			const token = jwt.sign(
				{ userId: user.id },
				config.get('jwtSecret'),
				{ expiresIn: '1h' },
			);

			return res.json({ token, userId: user.id });
		} catch (e) {
			return res.status(500).json({ message: 'Something went wrong, try again later' });
		}
	},
);

router.get('/users', auth, async (req, res) => {
	try {
		User.find((err, users) => {
			if (err) {
				return res.send(err);
			}
			return res.json(users);
		});
	} catch (e) {
		res.status(500).json({ message: 'Something went wrong, try again' });
	}
});

router.get('/users/:userId', auth, async (req, res) => {
	try {
		User.findById(req.params.userId, (err, singleUser) => {
			if (err) {
				return res.send(err);
			}
			return res.json(singleUser);
		});
	} catch (e) {
		res.status(500).json({ message: 'Something went wrong, try again' });
	}
});

router.delete('/users/:userId', auth, (req, res) => {
	User.findById(req.params.userId).deleteOne((err) => {
		if (err) {
			return res.send(err);
		}
		return res.sendStatus(204);
	});
});

module.exports = router;
