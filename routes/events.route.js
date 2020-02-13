const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../mddleware/auth.middleware');

const router = Router();

const Event = require('../models/eventSchema');

router.post(
	'/logs',
	[
		check('userid', 'Please input userID').exists(),
		check('eventDescription', 'Log must contain eventDescription').exists().isString(),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.stats(400).json({
					errors: errors.array(),
					message: 'Invalid data while creating new log',
				});
			}
			const { userid, date, eventDescription } = req.body;

			const event = new Event({ userid, date, eventDescription });
			console.log(event);
			await event.save();

			return res.status(201).json({ message: 'New log has been created' });
		} catch (e) {
			return res.status(500).json({ message: 'Something went wrong while creating new log' });
		}
	},
);
router.get('/logs', auth, async (req, res) => {
	try {
		Event.find((err, events) => {
			if (err) {
				return res.send(err);
			}
			return res.json(events);
		});
	} catch (e) {
		res.status(500).json({ message: 'Something went wrong, try again' });
	}
});

router.get('/logs/:userId', async (req, res) => {
	try {
		Event.findById(req.params.userId, (err, singleLog) => {
			if (err) {
				return res.send(err);
			}
			return res.status(200).json(singleLog);
		});
	} catch (e) {
		res.status(500).json({ message: 'Something went wrong, try again' });
	}
});

router.get('/logs/date', auth, async (req, res) => {
	try {
		await Event.find({
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
	} catch (e) {
		res.status(500).json({ message: 'Something went wrong, try again' });
	}
});

router.put(
	'/logs/logid',
	auth,
	[
		check('userid').exists(),
		check('eventDesctiption').exists(),
		check('date').exists(),
	],
	async (req, res) => {
		try {
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
		} catch (e) {
			res.status(500).json({ message: 'Something went wrong, try again' });
		}
	},
);

module.exports = router;
