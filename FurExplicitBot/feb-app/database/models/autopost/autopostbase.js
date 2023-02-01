/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define(
    'autopostbase',
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
        serverID: {
            type: Sequelize.STRING(30),
            allowNull: false,
        },
        nextEvent: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        interval: {
            type: Sequelize.STRING(10),
            allowNull: false,
        },
        type: {
            type: Sequelize.STRING(10),
            isIn: ['e621', 'fa', 'source'],
            alowNull: false,
        }
    }
);