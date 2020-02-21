const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const Manager = require('../models/managerSchema');
// const User = require('../models/userSchema');

const managerController = {
	createManager: async (req, res) => {
		try {
			const {
				email, password, firstName, lastName,
			} = req.body;
			const candidate = await Manager.findOne({ email });

			if (candidate) {
				return res.status(400).json({ message: 'Manager with simillar email already exists' });
			}

			const hashedPassword = await bcrypt.hash(password, 12);
			const manager = new Manager({
				email, password: hashedPassword, firstName, lastName,
			});
			await manager.save();

			return res.status(201).json({ message: 'Manager has been created' });
		} catch (e) {
			return res.status(500).json({ message: e });
		}
	},
	authManager: async (req, res) => {
		try {
			const { email, password } = req.body;
			const manager = await Manager.findOne({ email });

			if (!manager) {
				return res.status(400).json({ message: 'Manager with these credentials doesn\'t exist' });
			}

			const isMatch = await bcrypt.compare(password, manager.password);

			if (!isMatch) {
				return res.status(400).json({ message: 'Invalid email or password, try again' });
			}

			const token = jwt.sign(
				{ managerId: manager.id },
				config.get('jwtSecret'),
				{ expiresIn: '7h' },
			);

			return res.json({ token });
		} catch (e) {
			return res.status(500).json({ message: e });
		}
	},
};

module.exports = managerController;
