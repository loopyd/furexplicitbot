const autopost = require('../models/autopost');
const Sequelize = require('sequelize');

// A database controller for autopost management

module.exports = {
    data: { name: 'autopost' },
    createOrUpdate: async (autopostobjects) => {
        // Loop through the autopost objects we gave in
        autopostobjects.forEach(async (autopostobject) => {
            let matchCondition = {
                where: {
                    ID: autopostobject.autopostbase.ID
                },
            };
            // Check to see if the autopost base record 
            // already exists
            let result = await autopost.autopostbase.findAll(matchCondition).then((ab) => {
                return ab;
            }).catch(ERR);
            // If no results, create the base structure
            if (!result) {
                autopostobject.autopostbase = await autopost.autopostbase.create(autopostobject.autopostbase).then((ab) => {
                    return ab;
                }).catch (ERR);
            } else {
                // Otherwise, update the existing base
                // structure record
                autopostobject.autopostbase = await autopost.autopostbase.update(autopostobject.autopostbase, matchCondition).then((ab) => {
                    return ab;
                }).catch (ERR);
            }
            // Now we need to handle creation or update of the associated 
            // autopost record
            switch (autopostobject.autopostbase.type) {
                case 'e621':
                    // Check to see if the autopost e621 record already exists.
                    result = await autopost.autopostbase.findByPk(autopostobject.autopostbase.ID, {
                        include: ['autopostse621'],
                    }).then((ab) => {
                        return ab;
                    }).catch(ERR);
                    // If no results, create the autopost e621 record
                    if (!result) {
                        autopostobject.autoposte621 = await autopost.autoposte621.create({
                            tags: autopostobject.autoposte621.tags,
                            ID: autopostobject.autopostbase.ID,
                        }).then((ab) => {
                            return ab;
                        }).catch(ERR);
                    } else {
                        // Otherwise, update the existing autopost e621 record
                        autopostobject.autoposte621 = await autopost.autoposte621.update({
                            tags: autopostobject.autoposte621.tags,
                            ID: autopostobject.autopostbase.ID,
                        }, {
                            where: { ID: autopostobject.autopostbase.ID }
                        }).then((ab) => {
                            return ab;
                        }).catch(ERR);
                    }
                    break;
                case 'fa':
                    // Check to see if the autopost FA record already exists.
                    result = await autopost.autopostbase.findByPk(autopostobject.autopostbase.ID, {
                        include: ['autopostsfa'],
                    }).then((ab) => {
                        return ab;
                    }).catch(ERR);
                    // If no results, create the autopost FA record
                    if (!result) {
                        autopostobject.autopostfa = await autopost.autopostfa.create({
                            artistID: autopostobject.autopostfa.artistID,
                            ID: autopostobject.autopostbase.ID,
                        }).then((ab) => {
                            return ab;
                        }).catch(ERR);
                    } else {
                        // Otherwise, update the existing autopost FA record
                        autopostobject.autopostfa = await autopost.autopostfa.update({
                            artistID: autopostobject.autopostfa.artistID,
                            ID: autopostobject.autopostbase.ID,
                        }, {
                            where: { ID: autopostobject.autopostbase.ID }
                        }).then((ab) => {
                            return ab;
                        }).catch(ERR);
                    }
                    break;
                case 'source':
                    // Check to see if the autopost source record already exists.
                    result = await autopost.autopostbase.findByPk(autopostobject.autopostbase.ID, {
                        include: ['autopostssource'],
                    }).then((ab) => {
                        return ab;
                    }).catch(ERR);
                    // If no results, create the autopost source record
                    if (!result) {
                        autopostobject.autopostsource = await autopost.autopostsource.create({
                            messageID: autopostobject.autopostsource.messageID,
                            ID: autopostobject.autopostbase.ID,
                        }).then((ab) => {
                            return ab;
                        }).catch(ERR);
                    } else {
                        // Otherwise, update the existing autopost e621 record
                        autopostobject.autopostsource = await autopost.autopostsource.update({
                            messageID: autopostobject.autopostsource.messageID,
                            ID: autopostobject.autopostbase.ID,
                        }, {
                            where: { ID: autopostobject.autopostbase.ID }
                        }).then((ab) => {
                            return ab;
                        }).catch(ERR);
                    }
                    break;
                default:
                    await LOG(`[${module.exports.data.name}] Error: Failed to create assoicated record for autopost with ID ${autopost.autopostbase.ID}, as unknown autopost type \'${autopostobject.autopostbase.type}\' was specified.`)
                    break;
            }
        });
        return autopostobjects;
    },
    delete: async (autopostobjects) => {
        autopostobjects.forEach(async (autopostobject) => {
            let result = autopost.autopostbase.findAll({
                where: {
                    ID: autopostobject.autopostbase.ID,
                }
            }).then((ab) => {
                return ab;
            }).catch(ERR);
            if (result) {
                autopost.autopostbase.destroy({
                    where: {
                        ID: autopostobject.autopostbase.ID,
                    },
                });
            } else {
                await LOG(`${module.exports.data.name} Error: Failed to delete autopost base record with ID ${autopostobject.autopostbase.ID} as it does not exist.`);
            }
            switch (autopostobject.autopostbase.type) {
                case 'e621':
                    await autopost.autoposte621.destroy({
                        where: {
                            ID: autopostobject.autopostbase.ID,
                        },
                    });
                    break;
                case 'fa':
                    await autopost.autopostfa.destroy({
                        where: {
                            ID: autopostobject.autopostbase.ID,
                        }
                    });
                    break;
                case 'source':
                    await autopost.autopostsource.destroy({
                        where: {
                            ID: autopostobject.autopostbase.ID,
                        }
                    });
                    break;
                default:
                    await LOG(`${module.exports.data.name} Error: Failed to delete associated autopost record with ID ${autopostobject.autopostbase.ID}, as unknown autopost type \'${autopostobject.autopostbase.type}\' was specified.`);
                    break;
            }
        })
    },
    findByID: async (autopostID) => {
        let results = await autopost.autopostbase.findByPk(autopostID, { 
            include: ['autopostse621', 'autopostsfa', 'autopostssource'],
        }).then((ab) =>
        {
            return ab;
        }).catch(ERR);
        return results;
    },
    findByType: async (autoposttype) => {
        let results = await autopost.autopostbase.findAll({
            where: {
                type: autoposttype,
            },
            include: ['autopostse621', 'autopostsfa', 'autopostssource'],
        }).then((ab) => {
            return ab;
        }).catch(ERR);
        return results;
    },
}
