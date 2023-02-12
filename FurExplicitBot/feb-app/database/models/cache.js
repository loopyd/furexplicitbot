const poolcache = require('./cache/poolcache');
const poste621cache = require('./cache/poste621cache');
const postfacache = require('./cache/postfacache');
const stringcache = require('./cache/stringcache');

module.exports = {
    data: { name: 'cache' },
    poolcache: poolcache,
    poste621cache: poste621cache,
    postfacache: postfacache,
    stringcache: stringcache,
    sync: async () => {
        await poolcache.sync();
        await poste621cache.sync();
        await postfacache.sync();
        await stringcache.sync();
    }
}