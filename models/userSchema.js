const { Schema, model, Types } = require('mongoose');

const schema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		lastActivity: { type: String, default: 'just registered' },
		manager: { type: Types.ObjectId, ref: 'managers' },
	},
);


module.exports = model('users', schema);
