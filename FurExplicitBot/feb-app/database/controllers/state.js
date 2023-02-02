const state = require('../models/state');

// A database controller for state tracking management.

module.exports = {
    data: { name: 'state' },
    seenchangelog: {
        createOrUpdate: async (seenchangelogobjects) => {
            // Loop through seen changelog state objects we put in
            seenchangelogobjects.forEach(async (seenchangelogobject) => {
                let result = await state.seenchangelog.findAll({
                    where: { userID: seenchangelogobject.userID }
                }).then((ab) => {
                    return ab;
                }).catch(ERR);
                // if no result, create the changelog state object
                if (!result) {
                    seenchangelogobject = await state.seenchangelog.create(seenchangelogobject).then((ab) => {
                        return ab;
                    }).catch(ERR);
                } else {
                    // otherwise, update the changelog state object.
                    seenchangelogobject = await state.seenchangelog.update(seenchangelogobject, {
                        where: {
                            userID: seenchangelogobject.userID
                        }
                    }).then((ab) => {
                        return ab;
                    }).catch(ERR);
                }
            });
        },
        destroy: async (seenchangelogobjects) => {
            // Loop through changelog state objects we provided in
            seenchangelogobjects.forEach(async (seenchangelogobject) => {
                // Find matching changelog state objects.
                let result = await state.seenchangelog.findAll({
                    where: { userID: seenchangelogobject.userID }
                }).then((ab) => {
                    return ab;
                }).catch(ERR);
                // if result, delete the changelog state object
                if (result) {
                    await state.seenchangelog.destroy({
                        where: { userID: seenchangelogobject.userID }
                    }).catch(ERR);
                } else {
                    await LOG(`[${module.exports.data}] Error: Failed to delete changelog state with user ID ${seenchangelogobject.userID} as it was not found in the database.`)
                }
            });
        },
        findByUserID: async (userID) => {
            // Find a changelog state object by its userID.
            let result = await state.seenchangelog.findAll({
                where: { userID: userID }
            }).then((ab) => {
                return ab;
            }).catch(ERR);
            return result;
        },
    },
};