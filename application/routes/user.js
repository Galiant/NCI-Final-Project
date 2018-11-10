const express = require('express');
const router = express.Router();

/* GET register page. */
router.get('/register', (req, res, next) => {
  res.render('user/register');
});

/* GET login page. */
router.get('/login', (req, res, next) => {
  res.render('user/login');
});

module.exports = router;
