const botconfig = require('../models/config');

// this is a controller for bot configuration feature

// alows us to create or update the configuration in the database.
exports.createOrUpdate = async (serverId, serverConfig) => {
    // first thing we gotta do is create the master record, if it doesn't exist
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
            // If more than one result exists, we delete all but the first to cleanup
            // the database.
            if (result.count() > 1) {
                for (i = 0; i < result.count() - 1, i++;) {
                    await botconfig.configvalue.destroy(
                        {
                            where: {
                                serverId: serverId,
                                name: result[i].name,
                                description: result[i].description,
                                value: result[i].value,
                                type: result[i].type,
                            }
                        });
                }
            }
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
};

// allows us to destroy the configuration in the database, or delete specific values.
exports.destroy = async (serverId, serverConfig) => {
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
}

exports.get = async (serverId) => {
    let result = await botconfig.configbase.findByPk(serverId, { include: ['configvalues'] })
        .then( (configvalues) => {
            return configvalues;
        })
        .catch(ERR);
    return result;
}