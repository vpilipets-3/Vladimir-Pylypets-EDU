const passport = require('passport');
const { Strategy } = require('passport-local');
const userCol = require('../../models/userSchema');

const col = userCol.collection;

module.exports = function localStrategy() {
  passport.use(new Strategy(
    {
      usernameField: 'firstName',
      passwordField: 'lastName',
    },
    (firstName, lastName, done) => {
      async function lol() {
        const user = await col.findOne({ firstName });
        if (user.lastName === lastName) {
          done(null, user);
        } else {
          done(null, false);
        }
      }
      lol();
    },
  ));
};
