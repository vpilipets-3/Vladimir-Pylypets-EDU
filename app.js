const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const db = mongoose.connect('mongodb://localhost/EDU');
const port = process.env.PORT || 3000;
const User = require('./models/eventSchema');
const Event = require('./models/userSchema');
const Router = require('./routes/Router')(Event);
const EventRouter = require('./routes/EventRouter')(User);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', EventRouter, Router);

app.get('/', (request, response) => { // Home page handler
  response.send('hi!');
});

/*
Router.route('/logs/startDateendDate')
  .get((req, res) => {
    const result = db.events.find({
      minNum: { $gte: req.params.startDate },
      maxNum: { $lte: req.params.endDate },
    });
    return res.json(result);
  });
*/

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
