const express = require('express');

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

  Router.route('/user/:userId/del')// get user by ID handler
    .delete((req, res) => {
      const tempId = req.params.userId;
      User.findByIdAndRemove({ _id: tempId });
      return res.sendStatus(204);
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
