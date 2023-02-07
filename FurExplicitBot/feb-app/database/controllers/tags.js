const tags = require('../models/tags');

module.exports = {
    data: { name: 'tags' },
    servertagsblacklist: {
        createOrUpdate: async (servertagsblacklistobjects) => {
            // Loop through server tags blacklist objects we pass in
            servertagsblacklistobjects.forEach(async (servertagsblacklistobject) => {
                let result = await tags.servertagsblacklist.findAll({
                    where: { ID: servertagsblacklistobject.ID }
                }).then((ab) => {
                    return ab;
                }).catch(ERR);
                // if no result, create the server tags blacklist object
                if (!result) {
                    servertagsblacklistobject = await tags.servertagsblacklist.create(servertagsblacklistobject).then((ab) => {
                        return ab;
                    }).catch(ERR);
                } else {
                    // otherwise, update the server tags blacklist object
                    servertagsblacklistobject = await tags.servertagsblacklist.update(servertagsblacklistobject, {
                        where: {
                            ID: servertagsblacklistobject.ID
                        }
                    }).then((ab) => {
                        return ab;
                    }).catch(ERR);
                }
            });
        },
        destroy: async (servertagsblacklistobjects) => {
            // Loop through server tag blacklist objects we provided in 
            servertagsblacklistobjects.forEach(async (servertagsblacklistobject) => {
                // Find matching server tag blacklist objects.
                let result = await tags.servertagsblacklist.findAll({
                    where: { ID: servertagsblacklistobject.ID }
                }).then((ab) => {
                    return ab;
                }).catch(ERR);
                // if result, delete the server tag blacklist object
                if (result) {
                    await tags.servertagsblacklist.destroy({
                        where: { ID: servertagsblacklistobject.ID }
                    }).catch(ERR);
                } else {
                    await LOG(`[${module.exports.data}] Error: Failed to delete server tags blacklist entry with ID ${servertagsblacklistobject.ID} as it was not found in the database.`)
                }
            });
        },
        findByID: async (ID) => {
            // Find a servertagsblacklist entry by its ID.
            let result = await tags.servertagsblacklist.findAll({
                attributes: ['serverID', 'tag'],
                where: { ID: ID },
                order: [['tag', 'ASC']],
            }).then((ab) => {
                return ab;
            }).catch(ERR);
            return result;
        },
        findByServerID: async (serverID) => {
            // Find servertagsblacklist entries by server id.
            let results = await tags.servertagsblacklist.findAll({
                attributes: ['ID', 'tag'],
                where: { serverID: serverID },
                order: [['tag', 'ASC']],
            }).then((ab) => {
                return ab;
            }).catch(ERR);
            return results;
        },
        findByTag: async (tagName) => {
            // Find servertagsblacklist entries by tag name.
            let results = await tags.servertagsblacklist.findAll({
                attributes: ['ID', 'tag'],
                where: { tag: tagName },
                order: [['tag', 'ASC']],
            }).then((ab) => {
                return ab;
            }).catch(ERR);
            return results;
        }
    },
    usertag: {
        createOrUpdate: async (usertagobjects) => {
            // Loop through user tag objects we pass in
            usertagobjects.forEach(async (usertagobject) => {
                let result = await tags.usertag.findAll({
                    where: { ID: usertagobject.ID }
                }).then((ab) => {
                    return ab;
                }).catch(ERR);
                // if no result, create the user tag object
                if (!result) {
                    usertagobject = await tags.usertag.create(usertagobject).then((ab
                    ) => {
                        return ab;
                    }).catch(ERR);
                } else {
                    // otherwise, update the user tag object
                    usertagobject = await tags.usertag.update(usertagobject, {
                        where: {
                            ID: usertagobject.ID
                        }
                    }).then((ab) => {
                        return ab;
                    }).catch(ERR);
                }
            });
            return usertagobjects;
        },
        destroy: async (usertagobjects) => {
            // Loop through user tag objects we provided in
            usertagobjects.forEach(async (usertagobject) => {
                // Find matching user tag objects.
                let result = await tags.usertag.findAll({
                    where: { ID: usertagobject.ID }
                }).then((ab) => {
                    return ab;
                }).catch(ERR);
                // if result, delete the user tag object
                if (result) {
                    await tags.usertag.destroy({
                        where: { ID: usertagobject.ID }
                    }).catch(ERR);
                } else {
                    await LOG(`[${module.exports.data}] Error: Failed to delete user tags entry with ID ${usertagobject.ID} as it was not found in the database.`)
                }
            });
        },
    },
}