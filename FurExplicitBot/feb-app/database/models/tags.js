const servertagsblacklist = require('./tags/servertagsblacklist');
const usertag = require('./tags/usertag');

module.exports = {
    data: { name: 'tags' },
    servertagsblacklist: servertagsblacklist,
    usertag: usertag,
    sync: async () => {
        await servertagsblacklist.sync();
        await usertag.sync();
    }
}