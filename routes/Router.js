const express = require('express');
const event = require('../models/eventSchema');

const logs = event.collection;


function routes(User) {
  const Router = express.Router();
  Router.route('/user')//  list of users handler
    .post((req, res) => {
      const newUser = new User(req.body);
      newUser.save();
      return res.status(201).json(newUser);
    })
    .get((req, res) => {
      const query = {};
      if (req.query.firstName) {
        query.firstName = req.query.firstName;
      }
      User.find(query, (err, users) => {
        if (err) {
          return res.send(err);
        }
        return res.json(users);
      });
    });

  Router.route('/user/:userId')// get user by ID handler
    .delete((req, res) => { // Delete particular user and dependecies
      logs.deleteMany({ userid: req.params.userId });
      User.findById(req.params.userId).remove((err) => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(204);
      });
    })
    .get((req, res) => {
      User.findById(req.params.userId, (err, singleUser) => {
        if (err) {
          return res.send(err);
        }
        return res.json(singleUser);
      });
    });
  return Router;
}

module.exports = routes;

/*
  Router.route('/event')
  .get((req, res) => {
    const { query } = req;
    event.find(query, (err, events) => {
      if (err) {
        return res.send(err);
      }
      return res.json(events);
    });
  });
*/
