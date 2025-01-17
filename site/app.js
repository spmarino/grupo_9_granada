var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require("method-override");
var session = require('express-session');
const dbConnectionTest = require('./utils/dbConnectionTest');
require('dotenv').config();

var indexRouter = require('./routes/indexRouter');
var carritoRouter = require('./routes/carritoRouter');
var adminRouter = require('./routes/adminRouter');
var productsRouter = require('./routes/productsRouter');
var ingresoRouter = require('./routes/ingresoRouter');
var cookieCheck = require('./middlewares/cookieCheck')
var pagesRouter = require('./routes/pagesRouter');

var app = express();
dbConnectionTest();

dbConnectionTest();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));
app.use(session({
secret : 'esto es un secreto!'
}))

app.use(cookieCheck);

app.use('/', indexRouter);
app.use('/carrito', carritoRouter);
app.use('/admin', adminRouter);
app.use('/products', productsRouter);
app.use('/ingreso', ingresoRouter);
app.use('/pages/', pagesRouter);




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
