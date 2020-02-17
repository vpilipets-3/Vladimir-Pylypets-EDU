/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		if (!token) {
			return res.status(401).json({ message: 'Not authorized!' });
		}

		const decoded = jwt.verify(token, config.get('jwtSecret'));
		req.manager = decoded;
		next();
	} catch (e) {
		return res.status(401).json({ message: 'Not authorized!' });
	}
};
