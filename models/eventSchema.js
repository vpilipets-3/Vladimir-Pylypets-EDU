const { Schema, model } = require('mongoose');

const event = new Schema(
	{
		userid: { type: String, required: true },
		date: { type: Date, default: Date.now, required: false },
		eventDescription: { type: String, required: true },
	},
);

module.exports = model('events', event);
