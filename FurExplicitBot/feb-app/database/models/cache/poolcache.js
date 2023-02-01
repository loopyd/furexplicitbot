/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define('poolcache', {
  ID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  messageID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  poolIndex: {
    type: Sequelize.INTEGER(2),
    allowNull: false,
  },
  postID: {
    type: Sequelize.INTEGER(10),
    allowNull: false,
  },
});
