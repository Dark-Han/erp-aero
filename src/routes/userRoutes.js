const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const UserController = require('../controllers/userController');

const userController = new UserController();  

router.get('/info', authenticateToken, (req, res) => userController.getUserInfo(req, res));

module.exports = router;
