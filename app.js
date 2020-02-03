const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
// eslint-disable-next-line no-unused-vars
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

app.get('/download', (request, response) => { // Home page handler
  response.download('./Win10_1909_EnglishInternational_x64.iso', 'Win10_1909_EnglishInternational_x64.iso');
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
