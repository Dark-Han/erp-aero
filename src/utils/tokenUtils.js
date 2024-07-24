const jwt = require('jsonwebtoken');

exports.generateAccessToken = async (user) => {
    return await jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' });
}

exports.generateRefreshToken = async (user) => {
    return await jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }