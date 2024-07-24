const { User } = require('../models');

class UserService {
  async getUserById(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      throw new Error('Error retrieving user information');
    }
  }
}

module.exports = UserService;
