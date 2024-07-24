const sequelize = require('../config/config');
const User = require('./user');
const File = require('./file');

const db = { User, File, sequelize };

module.exports = db;
