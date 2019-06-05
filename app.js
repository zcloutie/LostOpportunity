var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');  
var dash = require('./routes/dash');
const dashboard = require("./routes/dashboard");
const registrationPage = require("./routes/register");

var app = express();

//app.get('/dash', dash.index);
//app.post('/add_dash', dash.add_dash);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(__dirname));
var engines = require('consolidate');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dashboard', dashboard);
app.use('/registration', registrationPage);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
