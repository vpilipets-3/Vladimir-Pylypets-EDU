const bcrypt = require('bcryptjs');
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
				email,
				password: hashedPassword,
				firstName,
				lastName,
				lastActivity,
				manager: req.manager.managerId,
			});
			await user.save();

			return res.status(201).json({ message: 'User has been created' });
		} catch (e) {
			return res.status(500).json({ message: e });
		}
	},
	showUsers: async (req, res) => {
		try {
			const result = await User.find({ manager: req.manager.managerId });
			return res.json(result);
		} catch (e) {
			return res.status(500).json({ message: e });
		}
	},
	showOneUser: async (req, res) => {
		try {
			const singleUser = await User.findById(req.params.userId);
			console.log(typeof singleUser.manager);
			console.log(typeof req.manager.managerId);
			if (singleUser.manager.id !== req.manager.managerId) {
				return res.status(403).json({ message: 'Premission denied' });
			}
			return res.json(singleUser);
		} catch (e) {
			return res.status(500).json({ message: `${e}` });
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
	updateUser: async (req, res) => {
		try {
			const user = await User.findById(req.params.userId);
			User.firstName = req.body.firstName;
			User.lastName = req.body.lastName;
			User.email = req.body.email;
			await user.save();
			return res.json(user);
		} catch (e) {
			return res.status(500).json({ message: 'Internal server error' });
		}
	},
};

module.exports = userController;
