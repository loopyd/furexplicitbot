const axios = require('axios');

const cache = require('../../../../database/controllers/cache');

module.exports = {
  data: { name: 'getPictures' },
  run: async (tags, serverID, channelID, nsfw) => {
    let post = await module.exports.getPicture(channelID);
    if (!post) {
      const cleanTags = await module.exports.getTags(tags, serverID);
      // store requested pics
      const results = await module.exports.requestPictures(cleanTags, nsfw);
      await module.exports.storePictures(channelID, results);
      // get first pic
      post = await module.exports.getPicture(channelID);
    }
    return post;
  },
  getTags: async (tagsRaw, serverID) => {
    const tags = tagsRaw.replaceAll(', ', ' ');
    const interaction = { guild: { id: serverID } };
    const safeTags = await client.functions.get('ENGINE_tagsCleanup').run(interaction, tags);
    return safeTags;
  },
  requestPictures: async (tags, nsfw) => {
    const response = await axios({
      method: 'GET',
      url: nsfw ? config.engine.e621.endpoint.nsfw : config.engine.e621.endpoint.sfw,
      headers: { 'User-Agent': `${config.package.name}/${config.package.version} by ${config.package.author} on GitHub` },
      params: {
        tags: `${tags} order:random`,
        limit: config.commands.autopost.maxCache,
        login: process.env.LOGIN_E621_USER,
        api_key: process.env.TOKEN_E621,
      },
    });
    return response.data.posts;
  },
  getPicture: async (channelID) => {
    const result = await cache.poste621cache.findByChannelID(channelID);
    if (!result) return null;
    await cache.poste621cache.destroy([
      {
        ID: result.ID,
      }
    ]).catch(ERR);
    return result;
  },
  storePictures: async (channelID, pool) => {
    await pool.forEach((post) => {
      if (post.tags.artist.length === 0 || post.file.url === null || post.id === null) return;
      cache.poste621cache.findOrCreate({
        where: { channelID, postID: post.id },
        defaults: { artist: post.tags.artist[0], directLink: post.file.url },
      }).catch(ERR);
    });
  },
};
