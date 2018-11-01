const express = require('express');
const router = express.Router();

// load book model
const Book = require('../models/book');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('shop/index', { title: 'The Book Boutique' });
});

/* GET allBooks page. */
router.get('/all', (req, res) => {
  Book.find({})
    .sort({ title: 'ascending' })
    .then(books => {
      res.render('shop/all', {
        books: books
      });
    })
});

/* GET add book */
router.get('/manage/add', (req, res) => {
  res.render('manage/add');
});

/* POST add book */
router.post('/shop/all', (req, res) => {
  // server side form validation for add book
  let errors = [];
  if (!req.body.cover) {
    errors.push({ text: 'Please add a cover!' });
  }
  if (!req.body.title) {
    errors.push({ text: 'Please add a title!' });
  }
  if (!req.body.author) {
    errors.push({ text: 'Please add a author!' });
  }
  if (!req.body.publisher) {
    errors.push({ text: 'Please add a publisher!' });
  }
  if (!req.body.bookdescription) {
    errors.push({ text: 'Please add a description!' });
  }
  if (!req.body.category) {
    errors.push({ text: 'Please add a category!' });
  }
  if (!req.body.year) {
    errors.push({ text: 'Please add a year!' });
  }
  if (!req.body.price) {
    errors.push({ text: 'Please add a price!' });
  }

  // check for error length. If it is length greather than zero we have a error
  if (errors.length > 0) {
    res.render('manage/add', {
      errors: errors,
      cover: req.body.cover,
      title: req.body.title,
      author: req.body.author,
      publisher: req.body.publisher,
      description: req.body.bookdescription,
      category: req.body.category,
      year: req.body.year,
      price: req.body.price
    })
  }
  else {
    const newUser = {
      cover: req.body.cover,
      title: req.body.title,
      author: req.body.author,
      publisher: req.body.publisher,
      description: req.body.bookdescription,
      category: req.body.category,
      year: req.body.year,
      price: req.body.price
    }
    new Book(newUser)
      .save()
      .then(book => {
        res.redirect('/all')
      })
  }
});

module.exports = router;
