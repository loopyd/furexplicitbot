/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define(
  'postcache',
  {
    ID: {
      type: Sequelize.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
    },
    channelID: {
      type: Sequelize.STRING(30),
      allowNull: false,
      // references: {
      //   model: 'autopostchannels',
      //   key: 'channelID',
      // },
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
      autoPostUnique: {
        fields: ['channelID', 'postID'],
      },
    },
  },
);
