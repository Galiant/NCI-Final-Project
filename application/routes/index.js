var express = require('express');
var router = express.Router();
var Book = require('../models/book');

/* GET home page. */
router.get('/', function(req, res, next) {
  var books = Book.find();
  res.render('shop/index', { title: 'The Book Boutique' });
});

module.exports = router;
