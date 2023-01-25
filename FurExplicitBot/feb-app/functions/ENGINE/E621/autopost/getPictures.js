const axios = require('axios');

const postcache = require('../../../../database/models/postcache');

async function getTags(tagsRaw, serverID) {
  const tags = tagsRaw.replaceAll(', ', ' ');
  const interaction = { guild: { id: serverID } };
  const safeTags = await client.functions.get('ENGINE_tagsCleanup').run(interaction, tags);
  return safeTags;
}

async function requestPictures(tags, nsfw) {
  const e6Config = config.engine.e621;
  const url = nsfw ? e6Config.endpoint.nsfw : e6Config.endpoint.sfw;
  const response = await axios({
    method: 'GET',
    url,
    headers: { 'User-Agent': `${config.package.name}/${config.package.version} by Flipper on e621` },
    params: {
      tags: `${tags} order:random`,
      limit: config.commands.autopost.maxCache,
      login: process.env.LOGIN_E621_USER,
      api_key: process.env.TOKEN_E621,
    },
  });
  return response.data.posts;
}

async function getPicture(channelID) {
  const result = await postcache.findOne({ where: { channelID } }).catch(ERR);
  if (!result) return null;
  await postcache.destroy({ where: { ID: result.ID } }).catch(ERR);
  return result;
}

async function storePictures(channelID, pool) {
  await pool.forEach((post) => {
    if (post.tags.artist.length === 0 || post.file.url === null || post.id === null) return;
    postcache.findOrCreate({
      where: { channelID, postID: post.id },
      defaults: { artist: post.tags.artist[0], directLink: post.file.url },
    }).catch(ERR);
  });
}

module.exports.run = async (tags, serverID, channelID, nsfw) => {
  let post = await getPicture(channelID);
  if (!post) {
    const cleanTags = await getTags(tags, serverID);
    // store requested pics
    const results = await requestPictures(cleanTags, nsfw);
    await storePictures(channelID, results);
    // get first pic
    post = await getPicture(channelID);
  }
  return post;
};

module.exports.help = {
  name: 'getPictures',
};
