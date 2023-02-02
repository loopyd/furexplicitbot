const cache = require('../models/cache');

module.exports = {
    data: { name: 'cache' },
    poolcache: {
        createOrUpdate: async (poolcacheobjects) => {
            // Loop through pool cache objects we provided in
            poolcacheobjects.forEach(async (poolcacheobject) => {
                let result = await cache.poolcache.findAll({
                    where: { ID: poolcacheobject.ID }
                }).then((ab) => {
                    return ab;
                }).catch(ERR);
                // if no result, create the pool object
                if (!result) {
                    poolcacheobject = await cache.poolcache.create(poolcacheobject).then((ab) => {
                        return ab;
                    }).catch(ERR);
                } else {
                    // otherwise, update the pool object.
                    poolcacheobject = await cache.poolcache.update(poolcacheobject, {
                        where: {
                            ID: poolcacheobject.ID
                        }
                    }).then((ab) => {
                        return ab;
                    }).catch(ERR);
                }
            });
        },
        destroy: async (poolcacheobjects) => {
            // Loop through pool cache objects we provided in
            poolcacheobjects.forEach(async (poolcacheobject) => {
                // Find matching pool cache objects.
                let result = await cache.poolcache.findAll({
                    where: { ID: poolcacheobject.ID }
                }).then((ab) => {
                    return ab;
                }).catch(ERR);
                // if result, delete the pool cache object
                if (result) {
                    await cache.poolcache.destroy({
                        where: { ID: poolcacheobject.ID }
                    }).catch(ERR);
                } else {
                    LOG(`[${module.exports.data}] Error: Failed to delete pool cache with ID ${poolcacheobject.ID} as it was not found in the database.`)
                }
            });
        },
        findByID: async (ID) => {
            // Find a pool cache object by its ID.
            let result = await cache.poolcache.findAll({
                where: { ID: ID }
            }).then((ab) => {
                return ab;
            }).catch(ERR);
            return result;
        },
        findByPoolIndex: async (poolIndex) => {
            // Find a pool cache object by its pool index.
            let result = await cache.poolcache.findAll({
                where: { poolIndex: poolIndex }
            }).then((ab) => {
                return ab;
            }).catch(ERR);
            return result;
        },
        findByMessageID: async (messageID) => {
            // Find a pool cache object by its message ID.
            let result = await cache.poolcache.findAll({
                where: { messageID: messageID }
            }).then((ab) => {
                return ab;
            }).catch(ERR);
            return result;
        },
    },
    poste621cache: {
        createOrUpdate: async (poste621cacheobjects) => {
            // Loop through e621 post cache objects we provided in
            poste621cacheobjects.forEach(async (poste621cacheobject) => {
                let result = await cache.poste621cache.findAll({
                    where: { ID: poste621cacheobject.ID }
                }).then((ab) => {
                    return ab;
                }).catch(ERR);
                // if no result, create the e621 post cache object
                if (!result) {
                    poste621cacheobject = await cache.poste621cache.create(poste621cacheobject).then((ab) => {
                        return ab;
                    }).catch(ERR);
                } else {
                    // otherwise, update the e621 post cache object.
                    poste621cacheobject = await cache.poste621cache.update(poste621cacheobject, {
                        where: {
                            ID: poste621cacheobject.ID
                        }
                    }).then((ab) => {
                        return ab;
                    }).catch(ERR);
                }
            });
            return poste621cacheobjects;
        },
        destroy: async (poste621cacheobjects) => {
            // Loop through e621 post cache objects we provided in
            poste621cacheobjects.forEach(async (poste621cacheobject) => {
                // Find matching e621 post cache objects.
                let result = await cache.poste621cache.findAll({
                    where: { ID: poste621cacheobject.ID }
                }).then((ab) => {
                    return ab;
                }).catch(ERR);
                // if result, delete the e621 post cache object
                if (result) {
                    await cache.poste621cache.destroy({
                        where: { ID: poste621cacheobject.ID }
                    }).catch(ERR);
                } else {
                    LOG(`[${module.exports.data}] Error: Failed to delete e621 post cache with ID ${poste621cacheobject.ID} as it was not found in the database.`)
                }
            });
        },
        findByID: async (ID) => {
            // Find a e621 post cache object by its ID.
            let result = await cache.poste621cache.findAll({
                where: { ID: ID }
            }).then((ab) => {
                return ab;
            }).catch(ERR);
            return result;
        },
        findByPostID: async (postID) => {
            // Find a e621 post cache object by its post ID
            let result = await cache.poste621cache.findAll({
                where: { postID: postID }
            }).then((ab) => {
                return ab;
            }).catch(ERR);
            return result;
        },
        findByArtist: async (artist) => {
            // Find a e621 post cache objects by an artist
            let results = await cache.poste621cache.findAll({
                where: { artist: artist }
            }).then((ab) => {
                return ab;
            }).catch(ERR);
            return results;
        },
        findByChannelID: async (channelID) => {
            // Find a e621 post cache objects by a channel ID
            let results = await cache.poste621cache.findAll({
                where: { channelID: channelID }
            }).then((ab) => {
                return ab;
            }).catch(ERR);
            return results;
        },
        findByDirectLink: async (directLink) => {
            // Find a e621 post cache objects by a direct link
            let results = await cache.poste621cache.findAll({
                where: { directLink: directLink }
            }).then((ab) => {
                return ab;
            }).catch(ERR);
            return results;
        },
    },
    postfacache: {
        createOrUpdate: async (postfacacheobjects) => {
            // Loop through e621 post cache objects we provided in
            postfacacheobjects.forEach(async (postfacacheobject) => {
                let result = await cache.postfacache.findAll({
                    where: { ID: postfacacheobject.ID }
                }).then((ab) => {
                    return ab;
                }).catch(ERR);
                // if no result, create the FurAffinity post cache object
                if (!result) {
                    postfacacheobject = await cache.postfacache.create(postfacacheobject).then((ab) => {
                        return ab;
                    }).catch(ERR);
                } else {
                    // otherwise, update the FurAffinity post cache object.
                    postfacacheobject = await cache.postfacache.update(postfacacheobject, {
                        where: {
                            ID: postfacacheobject.ID
                        }
                    }).then((ab) => {
                        return ab;
                    }).catch(ERR);
                }
            });
            return postfacacheobjects;
        },
        destroy: async (postfacacheobjects) => {
            // Loop through FurAffinity post cache objects we provided in
            postfacacheobjects.forEach(async (postfacacheobject) => {
                // Find matching FurAffinity post cache objects.
                let result = await cache.postfacache.findAll({
                    where: { ID: postfacacheobject.ID }
                }).then((ab) => {
                    return ab;
                }).catch(ERR);
                // if result, delete the FurAffinity post cache object
                if (result) {
                    await cache.postfacache.destroy({
                        where: { ID: postfacacheobject.ID }
                    }).catch(ERR);
                } else {
                    LOG(`[${module.exports.data}] Error: Failed to delete FurAffinity post cache with ID ${postfacacheobject.ID} as it was not found in the database.`)
                }
            });
        },
        findByID: async (ID) => {
            // Find a FurAffinity post cache object by its ID.
            let result = await cache.postfacache.findAll({
                where: { ID: ID }
            }).then((ab) => {
                return ab;
            }).catch(ERR);
            return result;
        },
        findByChannelID: async (channelID) => {
            // Find FurAffinity post cache objects by a channel ID
            let results = await cache.postfacache.findAll({
                where: { channelID: channelID }
            }).then((ab) => {
                return ab;
            }).catch(ERR);
            return results;
        },
        findBySubmissionID: async (submissionID) => {
            // Find a FurAffinity post cache object by a submission ID
            let results = await cache.postfacache.findAll({
                where: { submissionID: submissionID }
            }).then((ab) => {
                return ab;
            }).catch(ERR);
            return results;
        },
    }
}