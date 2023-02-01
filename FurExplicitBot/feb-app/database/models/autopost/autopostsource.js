/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define(
  'autopostsource',
  {
    messageID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
  }
);
