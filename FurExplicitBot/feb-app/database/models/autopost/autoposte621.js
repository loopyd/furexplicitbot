/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define(
  'autoposte621',
  {
    tags: {
      type: Sequelize.TEXT('tiny'),
      allowNull: false,
    },
  },
);
