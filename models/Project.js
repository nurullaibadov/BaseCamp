const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('Project', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT }
});