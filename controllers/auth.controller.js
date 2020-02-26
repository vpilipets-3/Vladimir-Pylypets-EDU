const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const db = require('../models');

const managerController = {
  register: async (req, res) => {
    try {
      const {
        email, password, firstName, lastName,
      } = req.body;
      const candidate = await db.Manager.findOne({ where: { email: req.body.email } });
      if (candidate) {
        return res.status(400).json({ message: 'User with simillar email already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      await db.Manager.create({
        email, password: hashedPassword, firstName, lastName,
      });
      return res.status(201).json({ message: 'Manager has been created' });
    } catch (e) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  login: async (req, res) => {
    try {
      const { password } = req.body;
      const manager = await db.Manager.findOne({ where: { email: req.body.email } });
      if (!manager) {
        return res.status(400).json({ message: 'Manager with these credentials doesn\'t exist' });
      }
      const isMatch = await bcrypt.compare(password, manager.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password, try again' });
      }

      const token = jwt.sign(
        { managerId: manager.id },
        config.get('jwtSecret'),
        { expiresIn: '7h' },
      );
      return res.json({ token });
    } catch (e) {
      return res.status(500).json({ message: e });
    }
  },
};

module.exports = managerController;
