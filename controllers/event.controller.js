const { validationResult } = require('express-validator');
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
			const event = new Event({ userid, date, eventDescription });
			await event.save();
			return res.status(201).json({ message: 'New log has been created' });
		} catch (e) {
			return res.status(500).json({ message: 'Something went wrong while creating new log' });
		}
	},
	showLogs: async (req, res) => {
		try {
			const result = await Event.find();
			return res.json(result);
		} catch (e) {
			return res.status(500).json({ message: 'Internal server error' });
		}
	},
	showLogsByUserId: async (req, res) => {
		try {
			const Logs = await Event.findById({ userid: req.event.userid });
			return res.status(200).json(Logs);
		} catch (e) {
			return res.status(500).json({ message: 'Internal server error' });
		}
	},
	showLogsByDate: async (req, res) => {
		try {
			const events = await Event.find({
				date: {
					$gte: new Date(req.body.from),
					$lt: new Date(req.body.to),
				},
			});
			return res.json(events);
		} catch (e) {
			return res.status(500).json({ message: 'Internal server error' });
		}
	},
	updateLog: async (req, res) => {
		try {
			const log = await Event.findById(req.params.logid);
			Event.date = req.body.date;
			Event.userid = req.body.userid;
			Event.eventDescription = req.body.evenDescription;
			await log.save();
			return res.json(log);
		} catch (e) {
			return res.status(500).json({ message: 'Internal server error' });
		}
	},
};

module.exports = EventController;
