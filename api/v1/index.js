var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');


const item = require('./item');
const item_category = require('./item_category');

// var authMiddleware = require('./auth/middleware');
// var Shared = require('./shared.js')

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


app.use('/item', item);
app.use('/item_category', item_category);

module.exports = app