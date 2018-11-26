const express = require('express');
const router = express.Router();

const { ensureAuthenticated } = require('../helpers/auth');
const { isAdmin } = require('../helpers/admin');

/* Load book model */
const Book = require('../models/book');

/* Load cart model */
const Cart = require('../models/cart');

/* Load order model */
const Order = require('../models/order');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('shop/index', { title: 'The Book Boutique' });
});

/* GET allBooks page */
router.get('/all', (req, res, next) => {
  const success_message = req.flash('success')[0];
  Book.find({})
    .sort({ title: 'ascending' })
    .then(books => {
      res.render('shop/all', {
        books: books,
        success_message: success_message,
        noMessage: !success_message
      });
    });
});

/* GET book page */
router.get('/book/:id', (req, res, next) => {
  Book.findOne({
      _id: req.params.id
    })
    .then(book => {
      res.render('shop/book', {
        book: book
      });
    });
});

/* GET manage books */
router.get('/manage', isAdmin, (req, res, next) => {
  const success_message = req.flash('success')[0];
  Book.find({})
    .sort({ title: 'ascending' })
    .then(books => {
      res.render('manage/manage', {
        books: books,
        success_message: success_message,
        noMessage: !success_message
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
          res.redirect('/manage');
        });
    });
});

/* Delete book - delete database data based on button press */
router.delete('/manage/:id', ensureAuthenticated, (req, res, next) => {
  Book.remove({ _id: req.params.id })
    .then(() => {
      req.flash('success_message', 'Book successfuly deleted!');
      res.redirect('/manage');
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

/* Increase quantity of product in cart*/
router.get('/increase/:id', (req, res, next) => {
  const bookId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.increaseByOne(bookId);
  req.session.cart = cart;
  res.redirect('/cart');
});

/* Reduce quantity of product in cart*/
router.get('/reduce/:id', (req, res, next) => {
  const bookId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(bookId);
  req.session.cart = cart;
  res.redirect('/cart');
});

/* Remove product from cart*/
router.get('/remove/:id', (req, res, next) => {
  const bookId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(bookId);
  req.session.cart = cart;
  res.redirect('/cart');
});

/* GET cart page */
router.get('/cart', (req, res, next) => {
  if (!req.session.cart) {
    return res.render('shop/cart', { books: null });
  }
  const cart = new Cart(req.session.cart);
  res.render('shop/cart', { books: cart.generateArray(), totalPrice: cart.totalPrice });
});

/* GET checkout page */
router.get('/checkout', ensureAuthenticated, (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('/cart');
  }

  let cart = new Cart(req.session.cart);
  let error_message = req.flash('error')[0];
  res.render('shop/checkout', { total: cart.totalPrice, error_message: error_message, noError: !error_message }); // pass the variable of total to the checkout page
});

/* POST checkout page */
router.post('/checkout', ensureAuthenticated, (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  let cart = new Cart(req.session.cart);

  // code below is from https://stripe.com/docs/api/charges/create
  const stripe = require("stripe")("sk_test_iHXQqwDVPhSUaDZXMYct2wOB");

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "eur",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Charge for testing environment"
  }, (err, charge) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    const order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.checkoutaddress,
      name: req.body.checkoutname,
      paymentId: charge.id
    });
    order.save((err, result) => {
      req.flash('success', 'Sucessfully bought product. Thanks for your purchase.');
      req.session.cart = null;
      res.redirect('/all');
    });
  });
});

module.exports = router;
