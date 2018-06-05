// modules laden (express als framework)
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Require .env files:
require('dotenv').config({ path: './.env' });

// view engine setup > templates weergeven
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Require routes:
var routes = require('./routes');

// Use routes:
app.use('/', routes);

//run
app.listen(process.env.PORT, function () {
  console.log('runs');
});
