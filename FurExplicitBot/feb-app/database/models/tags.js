const servertagsblacklist = require('./tags/servertagsblacklist');
const usertag = require('./tags/usertag');

// TODO: restructure servertagsblacklist into servertagsblacklistbase and servertagsblacklisttag
module.exports = {
    data: { name: 'tags' },
    servertagsblacklist: servertagsblacklist,
    usertag: usertag,
    sync: async () => {
        await servertagsblacklist.sync();
        await usertag.sync();
    }
}