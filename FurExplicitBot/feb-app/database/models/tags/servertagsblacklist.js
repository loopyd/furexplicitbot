/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define(
  'servertagsblacklist',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    serverID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    tag: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
  },
  {
    uniqueKeys: {
      uniqueBlock: {
        fields: ['serverID', 'tag'],
      },
    },
  },
);
