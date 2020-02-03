const event = require('../models/eventSchema');

const logs = event.collection;

function userController(User) {
  function createNewUser(req, res) {
    const newUser = new User(req.body);
    newUser.save();
    return res.status(201).json(newUser);
  }
  function lsUsers(req, res) {
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
  }
  function showOneUser(req, res) {
    User.findById(req.params.userId, (err, singleUser) => {
      if (err) {
        return res.send(err);
      }
      return res.json(singleUser);
    });
  }
  function deleteUser(req, res) {
    logs.deleteMany({ userid: req.params.userId });
    User.findById(req.params.userId).remove((err) => {
      if (err) {
        return res.send(err);
      }
      return res.sendStatus(204);
    });
  }
  return {
    createNewUser, lsUsers, showOneUser, deleteUser,
  };
}


module.exports = userController;
