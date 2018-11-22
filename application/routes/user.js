const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { ensureAuthenticated } = require('../helpers/auth');

/* Load cart model */
const Cart = require('../models/cart');

/* Load order model */
const Order = require('../models/order');

/* csrf protection middleware */
const csrf = require('csurf');

/* passport authentication middleware */
const passport = require('passport');

/* Load user model */
const User = require('../models/user');

const csrfProtection = csrf();
router.use(csrfProtection);

/* GET register page. */
router.get('/register', (req, res, next) => {
  res.render('user/register', { csrfToken: req.csrfToken() });
});

/* POST register page */
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
          req.flash('error_message', 'Email address is already in use!');
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
  res.render('user/login', { csrfToken: req.csrfToken() });
});

/* POST login page. */
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/user/login',
  failureFlash: true
}), (req, res, next) => {
  if (req.session.oldUrl) {
    const oldUrl = req.session.oldUrl;
    req.session.oldUrl = null; // don't store old Url here
    res.redirect(oldUrl);
  }
  else {
    res.redirect('/user/profile');
  }
});

/* GET user profile page */
router.get('/profile', ensureAuthenticated, (req, res, next) => {
  Order.find({ user: req.user }, (err, orders) => {
    if (err) {
      return res.write('Error!');
    }
    let cart;
    // loop through all orders
    orders.forEach((order) => {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile', { orders: orders });
  });
});

/* GET logout page */
router.get('/logout', (req, res, next) => {
  req.logout();
  req.flash('success_message', 'You are logged out.');
  res.redirect('/user/login');
});

module.exports = router;
