module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.session.oldUrl = req.url; // store old url for later after user login into application
    req.flash('error_message', 'Not authorized to use.');
    res.redirect('/user/login');
  }
}
