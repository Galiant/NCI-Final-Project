const express = require('express');
const router = express.Router();

const { ensureAuthenticated } = require('../helpers/auth');

/* Load book model */
const Book = require('../models/book');

/* Load cart model */
const Cart = require('../models/cart');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('shop/index', { title: 'The Book Boutique' });
});

/* GET allBooks page. */
router.get('/all', (req, res, next) => {
  Book.find({})
    .sort({ title: 'ascending' })
    .then(books => {
      res.render('shop/all', {
        books: books
      });
    });
});

/* GET add book */
router.get('/manage/add', ensureAuthenticated, (req, res, next) => {
  res.render('manage/add');
});

/* POST add book - add data to database based on button press */
router.post('/shop/all', ensureAuthenticated, (req, res, next) => {
  // server side form validation for add book. Code used from https://www.safaribooksonline.com/videos/node-js-express-and/9781789535952/9781789535952-video4_4
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
    });
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
    };
    new Book(newUser)
      .save()
      .then(book => {
        req.flash('success_message', 'Book successfuly added!');
        res.redirect('/all');
      });
  }
});

/* Edit book - edit database data based on button press and form */
router.get('/manage/edit/:id', ensureAuthenticated, (req, res, next) => {
  Book.findOne({
      _id: req.params.id
    })
    .then(book => {
      res.render('manage/edit', {
        book: book
      });
    });
});


/* Update book - update database data based on button press and form */
router.put('/all/:id', ensureAuthenticated, (req, res, next) => {
  Book.findOne({
      _id: req.params.id
    })
    .then(book => {
      //new values
      book.cover = req.body.cover;
      book.title = req.body.title;
      book.author = req.body.author;
      book.publisher = req.body.publisher;
      book.description = req.body.bookdescription;
      book.category = req.body.category;
      book.year = req.body.year;
      book.price = req.body.price;

      book.save()
        .then(book => {
          req.flash('success_message', 'Book successfuly updated!');
          res.redirect('/all');
        });
    });
});

/* Delete book - delete database data based on button press */
router.delete('/all/:id', ensureAuthenticated, (req, res, next) => {
  Book.remove({ _id: req.params.id })
    .then(() => {
      req.flash('success_message', 'Book successfuly deleted!');
      res.redirect('/all');
    });
});

/* Add to cart based on button press */
router.get('/add-to-cart/:id', (req, res, next) => {
  const bookId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  Book.findById(bookId, (err, book) => {
    if (err) {
      return res.redirect('/all');
    }
    cart.add(book, book.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/all');
  });
});

module.exports = router;
