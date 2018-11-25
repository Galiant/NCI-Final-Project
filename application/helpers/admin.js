module.exports = {
  isAdmin: (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.email === "admin@gmail.com") {
      return next();
    }
    req.session.oldUrl = req.url;
    req.flash('error_message', 'Not authorized to use.');
    res.redirect('/all');
  }
};
