const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const db = mongoose.connect('mongodb://localhost/EDU');
const port = process.env.PORT || 3000;
const User = require('./models/userSchema');
const Router = require('./routes/Router')(User);
// const event = require('./models/eventSchema');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', Router);

app.get('/', (request, response) => { // Home page handler
  response.send('hi!');
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
