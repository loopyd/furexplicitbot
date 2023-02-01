/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define(
  'autopostfa',
  {
    artistID: Sequelize.TEXT('tiny'),
  },
);
