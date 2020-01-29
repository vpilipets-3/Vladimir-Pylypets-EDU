const mongoose = require('mongoose');

const { Schema } = mongoose;

const event = new Schema(
  {
    userid: { type: String },
    date: { type: String, default: Date(Date.now()) },
    evenDescription: { type: String },
  },
);

module.exports = mongoose.model('event', event);
