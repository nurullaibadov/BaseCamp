const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false }
});

User.beforeCreate(async user => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.prototype.validPassword = async function(pwd) {
  return await bcrypt.compare(pwd, this.password);
};

module.exports = User;  