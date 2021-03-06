//Passport provides a useful function inside our req object called isAuthenticate
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}


module.exports = { ensureAuthenticated };