/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define(
  'postfacache',
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
    submissionID: {
      type: Sequelize.INTEGER(20),
      allowNull: false,
    },
  },
  {
    uniqueKeys: {
      postfacacheUnique: {
        fields: ['channelID', 'submissionID'],
      },
    },
  },
);
