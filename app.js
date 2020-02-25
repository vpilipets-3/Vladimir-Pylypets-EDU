const express = require('express');
const color = require('colors');
const logger = require('morgan');
const db = require('./models');
// const bodyParser = require('body-parser');

const app = express();
app.use(logger('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

const connect = async () => {
  await db.sequelize.sync();
  app.listen(PORT, () => {
    console.log(color.magenta(`Running on port ${color.yellow.bgBlack(PORT)}`));
  });
};

connect();

app.use('/api', require('./routes/auth.route'), require('./routes/user.route'), require('./routes/events.route'));
