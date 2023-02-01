const seenchangelog = require('./state/seenchangelog.js');

module.exports = {
    data: { name: 'state' },
    seenchangelog: seenchangelog,
    sync: async () => {
        await seenchangelog.sync();
    }
}
