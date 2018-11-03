const createError = require('http-errors');
const express = require('express'); // call express to be used by the application
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override'); // // allow application to execute put request
const bodyParser = require('body-parser'); // allow application to manipulate data in application (create, delete, update)
const logger = require('morgan');
const expressHbs = require('express-handlebars');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');

const app = express();

// connect to MongoDB with mongoose
mongoose.connect('mongodb://user:AbcD1234@ds129342.mlab.com:29342/bookboutique', { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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

// method override middleware
app.use(methodOverride('_method'));

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
