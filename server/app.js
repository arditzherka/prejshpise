var express = require('express');
var path = require('path');
var http = require('http');
const cors = require('cors');
var passport = require('passport');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/database');



//Connect to Database

mongoose.connect(config.database);

//On Connection
mongoose.connection.on('connected',()=>{
  console.log("Connected to database "+config.database);
});

//On Error
mongoose.connection.on('error',(err)=>{
  console.log("Database err "+err);
});
//Cors middleware




var index = require('./routes/index');
var users = require('./routes/users');
var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.get('/register', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

app.use('/users',users);


//Set Static Folder
app.use(express.static(path.join(__dirname,'public')));

app.use('/', index);
app.use('/users', users);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.get('*', (req, res) => {
  res.redirect('/');
});﻿

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
