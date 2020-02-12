const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');


function routes(User) {
  const Router = express.Router();
  const controller = userController(User);
  Router.route('/user')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/');
      }
    })
    .post(controller.createNewUser) // create new user
    .get(controller.lsUsers); // users list

  Router.route('/user/:userId')
    .delete(controller.deleteUser)// delete user
    .get(controller.showOneUser); // user by ID
  Router.route('/signIn')
    .post(passport.authenticate('local', {
      successRedirect: '/user',
      failureRedirect: '/',
    }));
  return Router;
}

module.exports = routes;
