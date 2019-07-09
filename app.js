var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var index = require('./routes/index');
var user = require('./routes/user');
var auth = require('./routes/auth');
var item = require('./routes/item');
var community = require('./routes/community');
var item_category = require('./routes/item_category');

var authMiddleware = require('./auth/middleware');
var Shared = require('./shared.js')

var app = express();

require('dotenv-safe').config();
console.log(process.env.DATABASE_URL)


// view engine setup
app.set('views', path.join(__dirname, 'views'));
//Use pug to generate views
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  credentials: true,
}));

app.use('/auth', auth);
app.use('/', index);
app.use('/user', authMiddleware.ensureLoggedIn, user); // authMiddleware.ensureLoggedIn,
app.use('/item', authMiddleware.ensureLoggedIn, item); // authMiddleware.ensureLoggedIn,
app.use('/community', authMiddleware.ensureLoggedIn, community); // authMiddleware.ensureLoggedIn,
app.use('/item_category', authMiddleware.ensureLoggedIn, item_category); // authMiddleware.ensureLoggedIn,

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  Shared.allowOrigin(res, req);
  var err = new Error('Address Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
 
  // res.render('error');
  Shared.allowOrigin(res, req);
  res.status(err.status || res.statusCode || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err: {}
  })
});

module.exports = app;
