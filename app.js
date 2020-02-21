const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const color = require('colors');

const app = express();

app.use(express.json({ extended: true }));
app.use('/api/auth', require('./routes/user.route'), require('./routes/events.route'));

const PORT = config.get('port') || 3000;

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log(color.bold.green('Connected to DB'));
  } catch (e) {
    console.log(color.bold.red(`ERROR!\nCould not connect to DB\n ${color.cyan(e.message)}`));
    process.exit(1);
  }
}

start();
app.listen(PORT, () => {
  console.log(color.magenta(`Running on port ${color.yellow.bgBlack(PORT)}`));
});
