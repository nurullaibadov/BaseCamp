const { Project, User } = require('../models');

exports.index = async (req, res) => {
  const projects = await Project.findAll({ include: [{ model: User, as: 'owner' }] });
  res.render('projects/index', { projects });
};

exports.new = (req, res) => res.render('projects/new');
exports.create = async (req, res) => {
  await Project.create({ ...req.body, ownerId: req.session.userId });
  res.redirect('/projects');
};

exports.show = async (req, res) => {
  const project = await Project.findByPk(req.params.id, { include: [{ model: User, as: 'owner' }] });
  if (!project) return res.status(404).send('Yok');
  const isOwner = project.ownerId === req.session.userId;
  res.render('projects/show', { project, isOwner });
};

exports.edit = async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project || project.ownerId !== req.session.userId) return res.status(403).send('Yetkisiz');
  res.render('projects/edit', { project });
};

exports.update = async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project || project.ownerId !== req.session.userId) return res.status(403).send('Yetkisiz');
  await project.update(req.body);
  res.redirect(`/projects/${project.id}`);
};

exports.destroy = async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (project && (project.ownerId === req.session.userId || req.session.isAdmin)) {
    await project.destroy();
  }
  res.redirect('/projects');
};