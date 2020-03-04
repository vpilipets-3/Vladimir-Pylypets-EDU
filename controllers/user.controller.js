const bcrypt = require('bcryptjs');
const db = require('../models');

const userController = {
  createUser: async (req, res) => {
    try {
      const {
        email, password, firstName, lastName, lastActivity,
      } = req.body;
      const candidate = await db.User.findOne({ where: { email: req.body.email } });

      if (candidate) {
        return res.status(400).json({ message: 'User with simillar email already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      await db.User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        lastActivity,
        managerId: req.manager.managerId,
      });
      return res.status(201).json({ message: 'User has been created' });
    } catch (e) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  showUsers: async (req, res) => {
    try {
      const result = await db.User.findAll({ where: { managerId: req.manager.managerId } });
      return res.json(result);
    } catch (e) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  showOneUser: async (req, res) => {
    try {
      const singleUser = await db.User.findByPk(req.params.userId);
      if (singleUser.managerId !== req.manager.managerId) {
        return res.status(403).json({ message: 'Premission denied' });
      }
      return res.json(singleUser);
    } catch (e) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const candidate = await db.User.findByPk(req.params.userId);
      if (candidate.managerId !== req.manager.managerId) {
        return res.status(403).json({ message: 'Premission denied' });
      }
      await db.User.destroy({
        where: {
          id: req.params.userId,
        },
      });
      return res.status(204).json({ message: 'Deleted' });
    } catch (e) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  updateUser: async (req, res) => {
    try {
      const user = await db.User.findByPk(req.params.userId);
      if (user.managerId !== (req.manager.managerId)) {
        return res.status(403).json({ message: 'Premission denied' });
      }
      await db.User.update({
        ...req.body,
        /*
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        */
      },
      {
        where: {
          id: req.params.userId,
        },
      });
      return res.json(user);
    } catch (e) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = userController;
