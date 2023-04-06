/*var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
*/
//import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import usersRouter from './routes/users.js';
import groupRouter from './routes/groups.js';
import messageRouter from './routes/messages.js';
import mainRouter from './routes/main.js';
import fileUpload from 'express-fileupload';

var app = express();
// view engine setup
app.set('views', path.join('./', 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join('./', 'public')));
app.use(fileUpload({
  limits: {fileSize: 100 * 1024 * 1024}
}));

app.use('/resources/',usersRouter);
app.use('/resources/',groupRouter);
app.use('/resources/',messageRouter);

app.use('/auth/',mainRouter);
// catch 404 and forward to error handler
/* app.use(function(req, res, next) {
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
*/
export default app;