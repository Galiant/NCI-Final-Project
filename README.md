# The Book Boutique

Final Project for Higher Diploma in Science in Web Technologies on NCI.

## Project overview

An online bookstore system is the main function of the web application where the user can check the book details, can register/login to buy the book, can add a book to wishlist or can add a book on the reading list.

## App functionality

The general aim of the project is to create a web application to function as an online e-commerce web application for books called The Book Boutique. In order to develop an e-commerce web application that allows fluid and fast environment of the application, the main technologies used to develop this application are:

- Node.js – as an asynchronous vent driven JavaScript runtime, Node is designed to build scalable network applications,
- Express – is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications,
- MongoDB – stores data in flexible, JSON-like documents, meaning fields can vary from document to document and data structure can be changed over time,
- Stripe – software allows individuals and businesses to receive payments over the Internet. Stripe provides the technical, fraud prevention, and banking infrastructure required to operate online payment systems.

The completed web application is user-friendly and fully responsive so it can automatically adapt to suit all screen resolutions and devices (desktop, laptop, tablet and phone).

The web application has to accomplish the general aim of a web application, aims on user side and aims on the admin side. The general aim of the web application is to introduce the site visitor to the site with an overview of the books where application displaying visually a book with a view to keep user interest and motivate the user to buy a book(s). Aims on user side are based on functionality that allows the user to register/login to interact with the application so the user can:

- buy a product – adding the product to cart and complete payment process after entering card details,
- leave a review – a user can leave a review for a specific book,
- add a book to wishlist – after adding book(s) to wishlist user will have a reminder about the book(s) for purchasing in the future,
- add a book on the reading list – by adding a book on the reading list user has the ability to track books which user already read,
- view orders – user can check own history orders.

Admin side aim is to give admin ability to add, edit and delete books which means that admin has full CRUD (Create, Read, Update, Delete) functionality over the application.

## Technologies

Considering the background of this project, an online bookstore system is the main function that needs to be achieved. To accomplish that functionality user should be able to register/login into the system, add book(s) to cart and enter card details during checkout operation.

Separately from main functionality user is able to add a book to wish list. Also, the user has the possibility to leave a review for each book. Research phase shows that a lot online bookstore doesn’t have the functionality to list the book on reading list so a user can track books in own collection in that way.

The developing of web application is made using Node.js, Express, MongoDB and Stripe to create a RESTful web application. Node.js run server together with Express what is Node framework and it is using JavaScript programming language. For creating an application skeleton, Express application generator is used. The server storing data in the MongoDB database and it is hosted at mlab.com. Mongoose is the ODM (Object Document Mapper) which is used to communicate with MongoDB database.

To dynamically generate an HTML page, it is used Handlebars logic-less templating engine. Handlebars weren’t the first choice but after researching what is in trend (which you can see in the picture below) the application using handlebars instead of the pug(jade). The web application is designed to be fully responsive using Bootstrap (version 4) framework which is based on flexbox layout.

Sensible data are encrypted with bcrypt and for user authentication is used passport.js local strategy. For validation and charging credit cards, and available payment process it is implemented Stripe.

The coding part of the application is done by using Cloud9 IDE. Cloud9 IDE is an online integrated development environment. During the development phase, the code is pushed to GitHub using git version control to prevent loss of data, to have time track about the project and to easy manipulate with the project, especially during the testing phase.

### Dependencies

Some of the main npm modules that are used in the application are:

- bcryptjs – helps to encrypt passwords
- body-parser – to handle HTTP POST request in Express.js version 4 and above, you need to install middleware module called body-parser. Body-parser extracts the entire body portion of an incoming request stream and exposes it on req.body. The middleware was a part of Express.js earlier but now you have to install it separately. This body-parser module parses the JSON, buffer, string and URL encoded data submitted using an HTTP POST request.
- connect-mongo – a MongoDB session store backed by mongoose
- cookie-parser – passing a secret string, which assigns req.secret so it may be used by other middleware
- csurf - node.js CSRF(Cross-site request forgery) protection middleware
- express – a fast, minimalist, web framework for node
- express-handlebars – a Handlebars view engine for Express
- express-session – create a session middleware with the given options
- hbs – express.js view engine for handlebars.js
- helmet - helps you secure your Express apps by setting various HTTP headers. It’s not a silver bullet, but it can help! Helmet is a collection of 13 smaller middleware functions that set HTTP headers.
- method-override – allow developer/user to use HTTP verbs such as put or delete
- mongoose – elegant MongoDB object modelling for node.js
- passport – Passport is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped into any Express-based web application. A comprehensive set of strategies support authentication using a username and password, Facebook, Twitter, etc. To implement this middleware into our web application it is used passport local strategy.
- stripe – the Stripe Node library provides convenient access to the Stripe API from applications written in server-side JavaScript.
