const poolcache = require('./cache/poolcache');
const poste621cache = require('./cache/poste621cache');
const postfacache = require('./cache/postfacache');

module.exports = {
    data: { name: 'cache' },
    poolcache: poolcache,
    poste621cache: poste621cache,
    postfacache: postfacache,
    sync: async () => {
        await poolcache.sync();
        await poste621cache.sync();
        await postfacache.sync();
    }
}