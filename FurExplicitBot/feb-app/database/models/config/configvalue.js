const sequalize = require('sequalize');

module.exports = sequelize.define(
    'configvalue',
    {
        name: {
            type: Sequelize.TEXT(tiny),
            allowNull: false,
        },
        description: {
            type: Sequelize.TEXT(medium),
            allowNull: false,
        },
        value: {
            type: Sequelize.TEXT(long),
            allowNull: false,
        },
        type: {
            type: Sequelize.TEXT(tiny),
            allowNull: false,
        },
    },
);