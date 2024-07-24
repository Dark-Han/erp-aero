const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const redisClient = require('../config/redisClient');

class AuthService {
  async findUserById(id) {
    return User.findOne({ where: { id } });
  }
  async registerUser(id, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return User.create({ id, password: hashedPassword });
  }

  async authenticateUser(id, password) {
    const user = await User.findByPk(id);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async updateRefreshToken(id, token) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('User not found');
    }
    user.refreshToken = token;
    await user.save();
    return user;
  }

  async blacklistToken(token) {
    const decoded = jwt.decode(token);
    const expiry = decoded.exp;
    const ttl = expiry - Math.floor(Date.now() / 1000);
    await redisClient.setEx(token, ttl, 'blacklisted');
  }

  async isTokenBlacklisted(token) {
    const result = await redisClient.get(token);
    return result === 'blacklisted';
  }

  async verifyRefreshToken(refreshToken) {
    try {
      const payload = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findByPk(payload.id);
      if (!user || user.refreshToken !== refreshToken) {
        return null;
      }
      return user;
    } catch {
      return null;
    }
  }
}

module.exports = AuthService;
