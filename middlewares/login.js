module.exports = (req, res, next) => {
  // Check if user is logged in
  if (!req.session.isLoggedIn) {
    return res.redirect('/auth');
  }
  next();
}