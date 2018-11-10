const express = require('express');
const router = express.Router();

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
      username: req.body.username,
      password: req.body.password,
      confirmpassword: req.body.confirmpassword,
      email: req.body.email,
      address: req.body.address,
      secondaddress: req.body.secondaddress,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip
    });
  }
  else {
    res.send('passed');
  }
});

/* GET login page. */
router.get('/login', (req, res, next) => {
  res.render('user/login');
});

module.exports = router;
