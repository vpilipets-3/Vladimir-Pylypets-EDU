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
      const events = await db.Event.findAll({
        include: [{
          model: db.User,
          as: 'event',
          where:
            { managerId: req.manager.managerId },
        }],
      });
      return res.json(events);
    } catch (e) {
      return res.status(500).json({ message: `${e}` });
    }
  },

  showLogsByUserId: async (req, res) => {
    try {
      const events = await db.Event.findAll({
        include: [{
          model: db.User,
          as: 'event',
          where:
          {
            id: req.params.userId,
            managerId: req.manager.managerId,
          },
        }],
      });
      if (!events) {
        return res.status(403).json({ message: 'Premission denied!' });
      }
      return res.status(200).json(events);
    } catch (e) {
      return res.status(500).json({ message: `${e}` });
    }
  },
  showLogsByDate: async (req, res) => {
    try {
      const events = await db.Event.findAll({
        include: [{
          model: db.User,
          as: 'event',
          where:
          {
            managerId: req.manager.managerId,
            createdAt: {
              [Op.lt]: new Date(req.body.to),
              [Op.gt]: new Date(req.body.from),
            },
          },
        }],
      });
      return res.status(200).json(events);
    } catch (e) {
      return res.status(500).json({ message: 'Invalid date' });
    }
  },

  updateLog: async (req, res) => {
    try {
      const event = await db.Event.findOne({
        where: { id: req.params.logId },
        include: [{
          model: db.User,
          as: 'event',
          where:
          {
            managerId: req.manager.managerId,
          },
        }],
      });
      if (!event) {
        return res.status(403).json({ message: 'Premission denied!' });
      }
      await db.Event.update({ eventDescription: req.body.eventDescription },
        {
          where: { id: req.params.logId },
        });
      return res.status(201).json({ message: 'Log has been updated' });
    } catch (e) {
      return res.status(500).json({ message: `${e}` });
    }
  },
};

module.exports = EventController;
