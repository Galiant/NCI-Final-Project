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
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'No user found' });
        }
      })
    }));
};
