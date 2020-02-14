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
		await	Event.find((err, events) => {
			if (err) {
				return res.send(err);
			}
			return res.json(events);
		});
	},
	showLogsByUserId: async (req, res) => {
		await	Event.findById(req.params.userId, (err, singleLog) => {
			if (err) {
				return res.send(err);
			}
			return res.status(200).json(singleLog);
		});
	},
	showLogsByDate: async (req, res) => {
		Event.find({
			date: {
				$gte: new Date('2020-01-11'),
				$lt: new Date('2020-03-25'),
			},
		}, (err, events) => {
			if (err) {
				return res.send(err);
			}
			return res.json(events);
		});
	},
	UpdateLog: async (req, res) => {
		Event.findById(req.params.logid, (err, log) => {
			if (err) {
				return res.send(err);
			}
			Event.date = req.body.date;
			Event.userid = req.body.userid;
			Event.eventDescription = req.body.evenDescription;
			log.save();
			return res.json(log);
		});
	},
};

module.exports = EventController;
