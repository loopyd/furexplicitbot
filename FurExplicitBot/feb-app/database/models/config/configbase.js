const sequalize = require('sequalize');

module.exports = sequelize.define(
    'configbase',
    {
        serverId: {
            type: Sequelize.STRING(30),
            primaryKey: true,
            allowNull: false,
        },
    },
);