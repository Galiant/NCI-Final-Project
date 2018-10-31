var express = require('express');
var router = express.Router();
var Book = require('../models/book');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('shop/index', { title: 'The Book Boutique' });
});

/* GET add book */
router.get('/manage/add', (req, res) => {
  res.render('manage/add');
});

/* POST add book */
router.post('/shop/all', (req, res) => {
  res.send('ok');
});

module.exports = router;
