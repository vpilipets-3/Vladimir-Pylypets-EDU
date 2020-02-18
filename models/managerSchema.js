const { Schema, model, Types } = require('mongoose');

const schema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true, select: false },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		users: [{ type: Types.ObjectId, ref: 'users' }],
	},

	{ versionKey: false },
);


module.exports = model('managers', schema);
