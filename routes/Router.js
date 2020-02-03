const express = require('express');
const userController = require('../controllers/userController');


function routes(User) {
  const Router = express.Router();
  const controller = userController(User);
  Router.route('/user')//  list of users handler
    .post(controller.createNewUser)
    .get(controller.lsUsers);

  Router.route('/user/:userId')// get user by ID handler
    .delete(controller.deleteUser)
    .get(controller.showOneUser);
  return Router;
}

module.exports = routes;
