/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define(
  'seenchangelog',
  {
    userID: {
      type: Sequelize.STRING(30),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
  },
  { timestamps: false },
);
