exports.ensureAuth = (req, res, next) => {
  req.session.userId ? next() : res.redirect('/auth/login');
};

exports.ensureAdmin = (req, res, next) => {
  req.session.isAdmin ? next() : res.status(403).send('ADMIN DEĞİLSİN!');
};