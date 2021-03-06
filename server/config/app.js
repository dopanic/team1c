// installed third-party packages
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors'); // to resolve cors error

// dotenv: environment variables
require('dotenv').config(); // to keep some vars safe

// modules for authentication
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');

// database setup
require("./mongoose");

// routers
const indexRouter = require('../routes/index');
const apiRouter = require('../routes/api');

// for relative paths
const { setegid } = require('process');



let app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(process.cwd(), './server/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

// set pages
if (process.env.DEPLOY_MODE === 'dev') {
  app.use('/', indexRouter);
}

// set apis
app.use('/api', apiRouter);

// catch all other routes and return the index file
if (process.env.DEPLOY_MODE !== 'dev') {
  app.use(express.static(path.join(__dirname, '../../client/dist/team1c')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../../client/dist/team1c', 'index.html')));
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
