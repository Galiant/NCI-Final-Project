var createError = require('http-errors');
var express = require('express'); // call express to be used by the application
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); // allow application to manipulate data in application (create, delete, update)
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');

var app = express();

// connect to MongoDB
mongoose.connect('mongodb://user:AbcD1234@ds129342.mlab.com:29342/bookboutique');

// view engine setup
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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
