const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');
const { ensureAuth, ensureAdmin } = require('../middleware/auth');

router.get('/register', ctrl.registerForm);
router.post('/register', ctrl.register);
router.get('/login', ctrl.loginForm);
router.post('/login', ctrl.login);
router.get('/logout', ctrl.logout);
router.get('/users', ensureAuth, ensureAdmin, ctrl.listUsers);
router.post('/users/:id/toggle-admin', ensureAuth, ensureAdmin, ctrl.toggleAdmin);
router.delete('/users/:id', ensureAuth, ensureAdmin, ctrl.destroyUser);

module.exports = router;