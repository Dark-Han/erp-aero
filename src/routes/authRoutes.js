const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

const authController = new AuthController();

router.post('/signin', (req, res, next) => authController.signin(req, res, next));
router.post('/signin/new_token', (req, res) => authController.newToken(req, res));
router.post('/signup', (req, res) => authController.signup(req, res));
router.get('/logout', (req, res) => authController.logout(req, res));

module.exports = router;
