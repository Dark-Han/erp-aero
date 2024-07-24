const jwt = require('jsonwebtoken');
const AuthService = require('../services/authService');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  authService = new AuthService();

  if (await authService.isTokenBlacklisted(token)) {
    return res.sendStatus(403);
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
