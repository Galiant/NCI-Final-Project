const createError = require('http-errors');
const express = require('express'); // call express to be used by the application
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override'); // // allow application to execute put and delete request
const flash = require('connect-flash'); // allow application to show flash message
const bodyParser = require('body-parser'); // allow application to manipulate data in application (create, delete, update)
const logger = require('morgan');
const session = require('express-session');
const Handlebars = require('handlebars'); // load Handlebars
const expressHbs = require('express-handlebars');
const H = require('just-handlebars-helpers'); // load the package to allow handlebars to use helpers
const passport = require('passport'); // allow application to authenticate users
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo')(session);

const routes = require('./routes/index');
const users = require('./routes/user');

// template helper for adding formatted dates https://github.com/tcort/handlebars-dateformat
Handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));

// register helpers for Handlebars. Source https://github.com/leapfrogtechnology/just-handlebars-helpers
H.registerHelpers(Handlebars);

// passport config
require('./config/passport')(passport);

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

// express session middleware
app.use(session({
  secret: 'thebookboutique',
  resave: false, // if it's true session will be saved on server on each request no matter if something changed or not
  saveUninitialized: false, // if it's true session will be stored to server if nothing happened
  store: new mongoStore({
    mongooseConnection: mongoose.connection
  }),
  cookie: { maxAge: 1209600000 } // set session for 14 days
}));

// passport authentication middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables for messages
app.use(function(req, res, next) {
  res.locals.success_message = req.flash('success_message');
  res.locals.error_message = req.flash('error_message');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});


app.use('/user', users);
app.use('/', routes);

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
