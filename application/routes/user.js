const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

/* Load user model */
const User = require('../models/user');

/* GET register page. */
router.get('/register', (req, res, next) => {
  res.render('user/register');
});

/* POST register form. */
router.post('/register', (req, res, next) => {
  let errors = [];
  if (req.body.password != req.body.confirmpassword) {
    errors.push({ text: 'Password do not match!' });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters!' });
  }

  if (errors.length > 0) {
    res.render('user/register', {
      errors: errors,
      email: req.body.email,
      password: req.body.password,
      confirmpassword: req.body.confirmpassword,
      address: req.body.address,
      secondaddress: req.body.secondaddress,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip
    });
  }
  else {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          req.flash('error_message', 'Email address already registered!');
          res.redirect('/user/register');
        }
        else {
          const newUser = new User({
            email: req.body.email,
            password: req.body.password,
            confirmpassword: req.body.confirmpassword,
            address: req.body.address,
            secondaddress: req.body.secondaddress,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash((newUser.password, newUser.confirmpassword), salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.confirmpassword = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_message', 'You are now registered and can login.');
                  res.redirect('/user/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
  }
});

/* GET login page. */
router.get('/login', (req, res, next) => {
  res.render('user/login');
});

module.exports = router;
