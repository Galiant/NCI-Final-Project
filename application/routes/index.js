var express = require('express');
var router = express.Router();
var Book = require('../models/book');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('shop/index', { title: 'The Book Boutique' });
});

/* GET add book */
router.get('/manage/add', function(req, res) {
  res.render('manage/add');
});

module.exports = router;
