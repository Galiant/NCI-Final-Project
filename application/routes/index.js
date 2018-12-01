const express = require('express');
const router = express.Router();

const { ensureAuthenticated } = require('../helpers/auth');
const { isAdmin } = require('../helpers/admin');

/* Load book model */
const Book = require('../models/book');

/* Load cart model */
const Cart = require('../models/cart');

/* Load wishlist model */
const Wishlist = require('../models/wishlist');

/* Load list model */
const List = require('../models/list');

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
    .populate('reviews.reviewUser')
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

/* Add to wishlist based on button press */
router.get('/add-to-wishlist/:id', ensureAuthenticated, (req, res, next) => {
  const bookId = req.params.id;
  let wishlist = new Wishlist(req.session.wishlist ? req.session.wishlist : {});

  Book.findById(bookId, (err, book) => {
    if (err) {
      return res.redirect('/all');
    }
    wishlist.add(book, book.id);
    req.session.wishlist = wishlist;
    console.log(req.session.wishlist);
    res.redirect('/all');
  });
});

/* Remove product from wishlist*/
router.get('/removewishlist/:id', ensureAuthenticated, (req, res, next) => {
  const bookId = req.params.id;
  let wishlist = new Wishlist(req.session.wishlist ? req.session.wishlist : {});

  wishlist.removeItem(bookId);
  req.session.wishlist = wishlist;
  res.redirect('/wishlist');
});


/* GET wishlist page */
router.get('/wishlist', ensureAuthenticated, (req, res, next) => {
  if (!req.session.wishlist) {
    return res.render('shop/wishlist', { books: null });
  }
  const wishlist = new Wishlist(req.session.wishlist);
  res.render('shop/wishlist', { books: wishlist.generateArray() });
});

/* Add to reading list based on button press */
router.get('/add-to-list/:id', ensureAuthenticated, (req, res, next) => {
  const bookId = req.params.id;
  let list = new List(req.session.list ? req.session.list : {});

  Book.findById(bookId, (err, book) => {
    if (err) {
      return res.redirect('/all');
    }
    list.add(book, book.id);
    req.session.list = list;
    console.log(req.session.list);
    res.redirect('/all');
  });
});

/* Remove product from reading list*/
router.get('/removelist/:id', ensureAuthenticated, (req, res, next) => {
  const bookId = req.params.id;
  let list = new List(req.session.list ? req.session.list : {});

  list.removeItem(bookId);
  req.session.list = list;
  res.redirect('/reading-list');
});


/* GET reading list page */
router.get('/reading-list', ensureAuthenticated, (req, res, next) => {
  if (!req.session.list) {
    return res.render('shop/list', { books: null });
  }
  const list = new List(req.session.list);
  res.render('shop/list', { books: list.generateArray() });
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


/* Add review */
router.post('/review/:id', (req, res, next) => {
  Book.findOne({
      _id: req.params.id
    })
    .then(book => {
      const newReview = {
        reviewBody: req.body.reviewBody,
        reviewUser: req.user.id
      };

      // Add to comments array
      book.reviews.unshift(newReview);

      book.save()
        .then(book => {
          res.redirect(`/book/${book.id}`);
        });
    });
});

/* GET Bestsellers category page */
router.get('/category/bestsellers', (req, res, next) => {
  Book.find({ category: "Bestsellers" })
    .sort({ title: 'ascending' })
    .then(books => {
      res.render('shop/bestsellers', {
        books: books
      });
    });
});

/* GET New releases category page */
router.get('/category/new-releases', (req, res, next) => {
  Book.find({ category: "New Releases" })
    .sort({ title: 'ascending' })
    .then(books => {
      res.render('shop/new', {
        books: books
      });
    });
});

/* GET Fiction category page */
router.get('/category/fiction', (req, res, next) => {
  Book.find({ category: "Fiction" })
    .sort({ title: 'ascending' })
    .then(books => {
      res.render('shop/fiction', {
        books: books
      });
    });
});

/* GET Non-fiction category page */
router.get('/category/non-fiction', (req, res, next) => {
  Book.find({ category: "Non-fiction" })
    .sort({ title: 'ascending' })
    .then(books => {
      res.render('shop/nonfiction', {
        books: books
      });
    });
});

/* GET Children's books category page */
router.get('/category/childrens-books', (req, res, next) => {
  Book.find({ category: "Children's Books" })
    .sort({ title: 'ascending' })
    .then(books => {
      res.render('shop/childrens', {
        books: books
      });
    });
});


module.exports = router;
