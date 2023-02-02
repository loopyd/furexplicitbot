const botconfig = require('../models/config');

// A database controller for configuration management.

module.exports = {
    data: { name: 'config' },
    createOrUpdate: async (serverId, serverConfig) => {
        // create the record if it does not exist
        let result = await botconfig.configbase.findAll({ where: { serverId: serverId } });
        if (!result) {
            await botconfig.configbase.create({
                serverId: serverId
            }).catch(ERR);
        }
        // Now we loop through our new config values
        serverConfig.forEach(async (element) => {
            result = await botconfig.configvalue.findAll({
                where: {
                    serverId: serverId,
                    name: element.name,
                }
            });
            // If no results, create new config structure.
            if (!result) {
                await botconfig.configvalue.create({
                    serverId: serverId,
                    name: element.name,
                    description: element.description,
                    value: element.value,
                    type: element.type,
                });
            } else {
                // Now we update the remaining record.
                await botconfig.configvalue.update(
                    {
                        serverId: serverId,
                        name: element.name,
                        description: element.description,
                        value: element.value,
                        type: element.type,
                    }, {
                    where: {
                        serverId: serverId,
                        name: element.name,
                    },
                }).catch(ERR);
            }
        });
    },
    destroy: async (serverId, serverConfig) => {
        // If server config is not specified, we want to delete the entire record of this
        // server.
        if (!serverConfig) {
            let result = await botconfig.configvalue.findByPk(serverId);
            if (result) {
                await botconfig.configvalue.destroy({ where: { serverId: serverId } }).catch(ERR);
            }
            result = await botconfig.configbase.findByPk(serverId);
            if (result) {
                await botconfig.configvalue.destroy({ where: { serverId: serverId } }).catch(ERR);
            }
        } else {
            // If server config is specified, we want to delete only the records for the
            // server we specify.
            serverConfig.forEach(async (element) => {
                let result = await botconfig.configbase.findByPk(serverId, {
                    where: {
                        name: element.name,
                        type: element.type,
                    },
                    include: ['configvalues']
                }).then( (configbase) => {
                    return configbase;
                }).catch (ERR);
                if (result && result.configvalues.count() > 0) {
                    await botconfig.configvalue.destroy({
                        where: {
                            serverId: serverId,
                            name: element.name,
                            type: element.type,
                        }
                    }).catch(ERR);
                }
            });
        }
    },
    getByServerId: async (serverId) => {
        let result = await botconfig.configbase.findByPk(serverId, { include: ['configvalues'] })
            .then((configvalues) => {
                return configvalues;
            })
            .catch(ERR);
        return result;
    },
}