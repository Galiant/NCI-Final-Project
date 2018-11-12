const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy; // use passports' local strategy

// load user model
const User = require('../models/user');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
      usernameField: 'email'
    },
    (email, password, done) => {
      console.log(email);
    }));
}
