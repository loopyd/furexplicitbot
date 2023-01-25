/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define(
  'autopostfasubmission',
  {
    ID: {
      type: Sequelize.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
    },
    channelID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    serverID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    artistID: Sequelize.TEXT('tiny'),
  },
);
