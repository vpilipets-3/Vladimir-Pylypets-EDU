const { validationResult } = require('express-validator');
const Users = require('../models/userSchema');
const Event = require('../models/eventSchema');

const EventController = {
	createLog: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.stats(400).json({
				errors: errors.array(),
				message: 'Invalid data while creating new log',
			});
		}
		const { userid, date, eventDescription } = req.body;
		try {
			const candidate = await Users.findById(req.body.userid);
			if (String(candidate.manager) !== req.manager.managerId) {
				return res.status(403).json({ message: 'Premission denied!' });
			}
			const event = new Event({ userid, date, eventDescription });
			await event.save();
			return res.status(201).json({ message: 'New log has been created' });
		} catch (e) {
			return res.status(500).json({ message: 'Something went wrong while creating new log' });
		}
	},
	showLogs: async (req, res) => {
		try {
			const managedUsers = await Users.find({ manager: req.manager.managerId });
			const events = await Event.find({
				userid: {
					$in: managedUsers,
				},
			});
			return res.json(events);
		} catch (e) {
			return res.status(500).json({ message: 'Internal server error' });
		}
	},
	showLogsByUserId: async (req, res) => {
		try {
			const candidate = await Users.findById(req.params.userid);
			if (String(candidate.manager) !== req.manager.managerId) {
				throw res.status(403).json({ message: 'Premission denied!' });
			}
			const Logs = await Event.find();
			return res.status(200).json(Logs);
		} catch (e) {
			return res.status(500).json({ message: 'Internal server error' });
		}
	},
	showLogsByDate: async (req, res) => {
		try {
			const managedUsers = await Users.find({ manager: req.manager.managerId });
			const events = await Event.find({
				date: {
					$gte: new Date(req.body.from),
					$lt: new Date(req.body.to),
				},
				userid: {
					$in: managedUsers,
				},
			});
			if (Object.entries(events).length === 0) {
				throw res.json({ message: 'No content' });
			}
			return res.json(events);
		} catch (e) {
			return res.status(500).json({ message: 'Invalid date' });
		}
	},
	updateLog: async (req, res) => {
		try {
			const logToCheck = await Event.findById(req.params.logid);
			const userToCheck = await Users.findById(logToCheck.userid);
			if (String(userToCheck.manager) !== req.manager.managerId) {
				throw res.status(403).json({ message: 'Premission denied!' });
			}
			logToCheck.eventDescription = req.body.eventDescription;
			await logToCheck.save();
			return res.json(logToCheck);
		} catch (e) {
			return res.status(500).json({ message: 'Internal server error' });
		}
	},
};

module.exports = EventController;
