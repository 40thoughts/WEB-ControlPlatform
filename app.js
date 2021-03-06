var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var swig = require('swig');
var os = require('os');
var hostname = os.hostname();

var indexPage = require('./routes/index');
var connectionPage = require('./routes/connection');
var controlPage = require('./routes/control');

var app = express();

app.engine('html', swig.renderFile); 
app.set('view engine', 'html'); 
app.set('views', path.join(__dirname, 'views')); 

app.set('view cache', false); // "false" to disable cache during developpement (express)
swig.setDefaults({ cache: false }); // "false" to disable cache during developpement (swig)

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'CPl4tf0rm', // "CPl4tf0rm" -> Secret key : use whatever yout wan't
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('hostname', hostname);

app.use('/', indexPage);
app.use('/connection', connectionPage);
app.use('/control', controlPage);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
