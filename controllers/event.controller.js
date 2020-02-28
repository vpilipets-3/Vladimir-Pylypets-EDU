const { Op } = require('sequelize');
const db = require('../models');


const EventController = {
  createLog: async (req, res) => {
    const { userId, eventDescription } = req.body;
    try {
      const candidate = await db.User.findOne({ where: { managerId: req.manager.managerId } });
      if (candidate.managerId !== req.manager.managerId) {
        return res.status(403).json({ message: 'Premission denied!' });
      }
      await db.Event.create({ userId, eventDescription });
      return res.status(201).json({ message: 'New log has been created' });
    } catch (e) {
      return res.status(500).json({ message: 'Something went wrong while creating new log' });
    }
  },

  showLogs: async (req, res) => {
    try {
      const managedUsers = await db.User.findAll({ where: { managerId: req.manager.managerId } });
      const userIdArr = [];
      managedUsers.forEach((element) => {
        userIdArr.push(element.id);
      });
      const events = await db.Event.findAll({
        where:
        {
          user_id: userIdArr,
        },
      });
      return res.json(events);
    } catch (e) {
      return res.status(500).json({ message: `${e}` });
    }
  },

  showLogsByUserId: async (req, res) => {
    try {
      const candidate = await db.User.findByPk(req.params.userId);
      if (candidate.managerId !== req.manager.managerId) {
        return res.status(403).json({ message: 'Premission denied!' });
      }
      const Logs = await db.Event.findByAll(req.params.user_id);
      return res.status(200).json(Logs);
    } catch (e) {
      return res.status(500).json({ message: `${e}` });
    }
  },
  showLogsByDate: async (req, res) => {
    try {
      const managedUsers = await db.User.findAll({ where: { managerId: req.manager.managerId } });
      const userIdArr = [];
      managedUsers.forEach((element) => {
        userIdArr.push(element.id);
      });
      const events = await db.Event.findAll({
        where:
        {
          user_id: userIdArr,
          createdAt: {
            [Op.lt]: new Date(req.body.to),
            [Op.gt]: new Date(req.body.from),
          },
        },
      });
      return res.status(200).json(events);
    } catch (e) {
      return res.status(500).json({ message: 'Invalid date' });
    }
  },

  updateLog: async (req, res) => {
    try {
      const logToCheck = await db.Event.findByPk(req.params.logId);
      const userToCheck = await db.User.findByPk(logToCheck.userId);
      console.log(userToCheck);
      if (userToCheck.managerId !== req.manager.managerId) {
        return res.status(403).json({ message: 'Premission denied!' });
      }
      await db.Event.update({
        eventDescription: req.body.eventDescription,
      },
      {
        where: {
          id: req.params.logId,
        },
      });
      return res.status(201).json({ message: 'Log has been updated' });
    } catch (e) {
      return res.status(500).json({ message: `${e}` });
    }
  },
};

module.exports = EventController;
