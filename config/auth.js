module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {    // if user is logged-in
      return next();
    }
    // if user is not logged-in
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');
  }
};
