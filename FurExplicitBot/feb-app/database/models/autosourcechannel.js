/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define(
  'autosourcechannel',
  {
    channelID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
    },
    serverID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
  },
  {
    uniqueKeys: {
      uniqueAutosource: {
        fields: ['serverID', 'channelID'],
      },
    },
  },
);
