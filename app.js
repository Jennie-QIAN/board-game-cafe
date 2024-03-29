require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');


// Set up the database
require('./configs/db.config');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();
require('./configs/session.config')(app);

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

//register handlebars helper function
hbs.registerHelper('localdate', function(dateTime) {
  return dateTime.toLocaleString();
});

hbs.registerHelper('isodate', function(dateTime) {
  return (new Date(dateTime)).toISOString().slice(0, 16);
});

hbs.registerHelper('ifin', function(elem, list, options) {
  if (list.indexOf(elem) > -1) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('carouselPreviousIndex', function(index, list) {
  if (index === 0) {
    return list.length - 1;
  }
  return index - 1;
});

hbs.registerHelper('carouselNextIndex', function(index, list) {
  if (index + 1 >= list.length) {
    return 0;
  }
  return index + 1;
});

// default value for title local
app.locals.title = 'Board Game Café';
app.locals.currentYear = (new Date()).getFullYear();

const index = require('./routes/index');
app.use('/', index);
const auth = require('./routes/auth');
app.use('/', auth);
const plays = require('./routes/plays');
app.use('/', plays);
const games = require('./routes/games');
app.use('/', games);
const api = require('./routes/api');
app.use('/api', api);

module.exports = app;
