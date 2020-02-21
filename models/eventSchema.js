const { Schema, model, Types } = require('mongoose');

const event = new Schema(
  {
    userid: { type: Types.ObjectId, ref: 'users', required: true },
    date: { type: Date, default: Date.now, required: false },
    eventDescription: { type: String, required: true },
  },

  { versionKey: false },
);

module.exports = model('events', event);
