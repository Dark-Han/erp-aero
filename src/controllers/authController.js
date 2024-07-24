const AuthService = require('../services/authService');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');
const { validatePassword } = require('../utils/validatePassword'); 
const { parsePhoneNumberFromString } = require('libphonenumber-js');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async signin(req, res) {
    const { id, password } = req.body;

    try {
      if (!id || !password) {
        return res.status(400).json({ error: 'ID and password are required' });
      }
      const user = await this.authService.authenticateUser(id, password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const accessToken = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);
      await this.authService.updateRefreshToken(user.id, refreshToken);

      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred during sign-in' });
    }
  }

  async newToken(req, res) {
    const { refreshToken } = req.body;
    try {
      const user = await this.authService.verifyRefreshToken(refreshToken);
      if (!user) {
        return res.status(403).json({ error: 'Invalid refresh token' });
      }

      const newAccessToken = await generateAccessToken(user);
      const newRefreshToken = await generateRefreshToken(user);
      await this.authService.updateRefreshToken(user.id, newRefreshToken);

      res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
      res.status(403).json({ error: 'Invalid refresh token' });
    }
  }

  async signup(req, res) {
    const { id, password } = req.body;
  
    try {
      // Check if ID and password are provided
      if (!id || !password) {
        return res.status(400).json({ error: 'ID and password are required' });
      }
  
      // Validate US phone number format
      const phoneNumber = parsePhoneNumberFromString(id, 'US');
      if (!phoneNumber || !phoneNumber.isValid()) {
        return res.status(400).json({ error: 'Invalid US phone number' });
      }
  
      // Validate password
      if (!validatePassword(password)) {
        return res.status(400).json({ error: 'Password does not meet standards' });
      }
  
      // Check if user already exists
      const existingUser = await this.authService.findUserById(phoneNumber.number);
      if (existingUser) {
        return res.status(400).json({ error: 'User ID already exists' });
      }
  
      // Register the new user
      const user = await this.authService.registerUser(phoneNumber.number, password);
      res.status(201).json(user);
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: 'An error occurred during sign-up' });
    }
  }
  

  async logout(req, res) {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    const { refreshToken } = req.body;

    try {
      const user = await this.authService.verifyRefreshToken(refreshToken);
      if (user) {
        await this.authService.updateRefreshToken(user.id, null);
        await this.authService.blacklistToken(accessToken);
      }

      res.status(204).json({ message: 'Logout successful' });
    } catch (error) {
      res.status(403).json({ error: 'Invalid refresh token' });
    }
  }
}

module.exports = AuthController;
