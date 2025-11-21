const { User } = require('../models');

exports.registerForm = (req, res) => res.render('auth/register', { error: null });
exports.loginForm = (req, res) => res.render('auth/login', { error: null });

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (await User.findOne({ where: { username } })) 
    return res.render('auth/register', { error: 'Bu isim alınmış!' });
  
  const user = await User.create({ username, password });
  if (await User.count() === 1) { user.isAdmin = true; await user.save(); }
  res.redirect('/auth/login');
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user || !await user.validPassword(password))
    return res.render('auth/login', { error: 'Hatalı giriş!' });
  
  req.session.userId = user.id;
  req.session.username = user.username;
  req.session.isAdmin = user.isAdmin;
  res.redirect('/projects');
};

exports.logout = (req, res) => { req.session.destroy(); res.redirect('/auth/login'); };

exports.listUsers = async (req, res) => {
  const users = await User.findAll();
  res.render('auth/users', { users });
};

exports.toggleAdmin = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) { user.isAdmin = !user.isAdmin; await user.save(); }
  res.redirect('/auth/users');
};

exports.destroyUser = async (req, res) => {
  await User.destroy({ where: { id: req.params.id } });
  res.redirect('/auth/users');
};