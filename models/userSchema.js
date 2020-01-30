const mongoose = require('mongoose');

const { Schema } = mongoose;

const users = new Schema(
  {
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    lastActivity: { type: String, default: null },
  },
);


module.exports = mongoose.model('users', users);
