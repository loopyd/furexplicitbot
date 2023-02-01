/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define(
  'poste621cache',
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
    postID: {
      type: Sequelize.INTEGER(20),
      allowNull: false,
    },
    artist: {
      type: Sequelize.TEXT('tiny'),
      allowNull: false,
    },
    directLink: {
      type: Sequelize.TEXT('tiny'),
      allowNull: false,
    },
  },
  {
    uniqueKeys: {
      poste621cacheUnique: {
        fields: ['channelID', 'postID'],
      },
    },
  },
);
