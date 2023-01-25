/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define(
  'personalTag',
  {
    ID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    tag: {
      type: Sequelize.TEXT('tiny'),
      allowNull: false,
    },
    score: {
      type: Sequelize.TINYINT,
      allowNull: false,
    },
  },
  {
    uniqueKeys: {
      channelTagUnique: {
        fields: ['userID', 'tag'],
      },
    },
  },
);
