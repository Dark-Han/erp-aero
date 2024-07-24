const UserService = require('../services/userService');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getUserInfo(req, res) {
    const { id } = req.user;
    try {
      const user = await this.userService.getUserById(id);
      res.status(200).json({ id: user.id });
    } catch (err) {
      if (err.message === 'User not found') {
        res.status(404).send('User not found');
      } else {
        res.status(500).send('Error retrieving user information');
      }
    }
  }
}

module.exports = UserController;  // Export the class itself
