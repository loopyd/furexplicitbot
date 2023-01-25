/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define(
  'autopostchannel',
  {
    channelID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
    },
    serverID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    tags: Sequelize.TEXT('tiny'),
    nextEvent: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    interval: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
  },
  {
    uniqueKeys: {
      autoPostUnique: {
        fields: ['channelID', 'serverID'],
      },
    },
  },
);
