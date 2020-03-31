require('dotenv').config()

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var webhooksRouter = require('./routes/webhooks');

var app = express();

app.use(logger('dev'));
app.use(express.json({
  // We need to add the verify function to expose the rawBody for validating Kontent webhooks
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/webhooks', webhooksRouter);

module.exports = app;
