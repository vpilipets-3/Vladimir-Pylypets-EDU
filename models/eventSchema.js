const mongoose = require('mongoose');

const { Schema } = mongoose;

const date = new Date();
const datetr = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

const event = new Schema(
  {
    userid: { type: String },
    date: { type: String, default: datetr },
    evenDescription: { type: String },
  },
);

module.exports = mongoose.model('event', event);
