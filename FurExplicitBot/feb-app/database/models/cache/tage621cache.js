/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define(
    'tage621cache',
    {
        ID: {
            type: Sequelize.INTEGER(10),
            primaryKey: true,
            autoIncrement: true,
        },
        tag: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true,
        }
    }, {
    uniqueKeys: {
        tage621cacheUnique: ['tag'],
    }
});

