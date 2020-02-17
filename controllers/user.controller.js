const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const userController = {
	createUser: async (req, res) => {
		try {
			const {
				email, password, firstName, lastName, lastActivity,
			} = req.body;
			const candidate = await User.findOne({ email });

			if (candidate) {
				throw res.status(400).json({ message: 'User with simillar email already exists' });
			}

			const hashedPassword = await bcrypt.hash(password, 12);
			const user = new User({
				email, password: hashedPassword, firstName, lastName, lastActivity,
			});
			await user.save();

			return res.status(201).json({ message: 'User has been created' });
		} catch (e) {
			return res.status(500).json({ message: e });
		}
	},
	authUser: async (req, res) => {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ email });

			if (!user) {
				throw res.status(400).json({ message: 'User with this credentials doesn\'t exist' });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				throw res.status(400).json({ message: 'Invalid email or password, try again' });
			}

			const token = jwt.sign(
				{ userId: user.id },
				config.get('jwtSecret'),
				{ expiresIn: '1h' },
			);

			return res.json({ token, userId: user.id });
		} catch (e) {
			return res.status(500).json({ message: e });
		}
	},
	showUsers: async (req, res) => {
		try {
			const result = await User.find();
			return res.json(result);
		} catch (e) {
			return res.status(500).json({ message: e });
		}
	},
	showOneUser: async (req, res) => {
		try {
			const singleUser = await User.findById(req.params.userId);
			return res.json(singleUser);
		} catch (e) {
			return res.status(500).json({ message: e });
		}
	},
	deleteUser: async (req, res) => {
		try {
			await User.findById(req.params.userId).deleteOne();
			return res.sendStatus(204);
		} catch (e) {
			return res.status(500).json({ message: e });
		}
	},
};

module.exports = userController;
