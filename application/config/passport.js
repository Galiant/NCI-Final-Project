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
      // match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'No user found with this email address!' });
        }
        // match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          }
          else {
            return done(null, false, { message: 'Password incorrect. Please try again!' });
          }
        });
      });
    }));

  passport.serializeUser((user, done) => {
    done(null, user.id); // whenever you want to store the user in session serialized by Id
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
