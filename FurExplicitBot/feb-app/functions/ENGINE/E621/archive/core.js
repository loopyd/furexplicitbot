// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete({ timeout: 10000 }));
}

// assignes requested posts to user for reactions
function Timeout(msg, userID, messageOwner, config) {
  messageOwner.set(msg.id, userID);
  setTimeout(async () => {
    messageOwner.delete(msg.id);
    if (await msg.client.functions.get('FUNC_checkBotPermissions').run(msg, 'ManageMessages')) msg.reactions.removeAll().catch();
  }, config.reactionsTimeout);
}

function tagsReplace(tags, search, replace) { return tags.replace(new RegExp(search, 'g'), replace); }

async function getTags(message, args) {
  let [limit] = args;
  let tags = args.join(' ');
  tags = tagsReplace(tags, ', ', ' ');
  if (isNaN(limit) || limit === 0) limit = 1;
  else tags = tags.slice(limit.length + 1);
  const safeTags = await message.client.functions.get('FUNC_tagsCleanup').run(message, tags);
  return [safeTags, limit];
}

function checkRequestedLimit(message, limit) {
  let decision = true;
  if (limit > 10) {
    // if (limit > 10 && message.author.id !== config.owner) {
    messageFail(message, 'You can only requwest a maximum of 10 images at the twime.');
    decision = false;
  }
  return decision;
}

function getEndpoint(message, config) {
  let uri = config.e621.endpoint.sfw;
  if (message.channel.nsfw) uri = config.e621.endpoint.nsfw;
  return uri;
}

function buildRequest(uri) {
  const version = require('../../../../package.json');
  return {
    method: 'GET',
    uri,
    headers: { 'User-Agent': `FurExplicitBot/${version.version} by Flipper on e621` },
    json: true,
  };
}

async function getRequest(request) {
  const rp = require('request-promise');
  const pics = await rp(request);
  return pics.posts;
}

async function requestPictures(message, config, tags, limit) {
  const endpoint = getEndpoint(message, config);
  const uri = `${endpoint}?tags=${tags} order:random&limit=${limit}&login=${config.env.get('e621_login')}&api_key=${config.env.get('e621_api_key')}`;
  const posts = await getRequest(buildRequest(uri));
  return posts;
}

function postPictures(MessageEmbed, message, config, limit, messageOwner, pool) {
  if (pool.length === 0) return messageFail(message, 'Sowwy, I found no pictures with your tags. uwu');
  if (pool.length !== limit) {
    if (pool.length !== 10 && limit !== 10) messageFail(message, `Thewe arwe ownly ${pool.length + 1} post(s) with your tawgs.`);
  }
  pool.forEach(async (post) => {
    const embed = new EmbedBuilder();
    const extention = post.file.ext;
    let picURL = post.sample.url;
    if (extention === 'gif') picURL = post.file.url;
    if (extention === 'webm' || extention === 'swf' || extention === 'mp4') embed.addFields([{ name: 'Direct video link', value: post.file.url }]);

    embed
      .setColor(config.e621.color)
      .setTitle(`Artist: ${post.tags.artist[0]} [e621 link]`)
      .setURL(`https://e621.net/posts/${post.id}`)
      .setImage(picURL)
      .setFooter(config.e621.label, config.e621.logo)
      .setTimestamp();
    const msg = await message.channel.send({ embed });
    await msg.react('❌');
    await msg.react(message.client.guilds.cache.get(config.emoji.serverID).emojis.cache.get(config.emoji.details));
    Timeout(msg, message.author.id, messageOwner, config);
  });
}

module.exports.run = async (client, message, args, config, EmbedBuilder, messageOwner) => {
  const reaction_loading = await message.react(client.guilds.cache.get(config.emoji.serverID).emojis.cache.get(config.emoji.loading));
  const editedTags = await getTags(message, args);
  const tags = editedTags[0];
  let limit = editedTags[1];
  if (!await checkRequestedLimit(message, limit, reaction_loading)) limit = 10;
  await postPictures(MessageEmbed, message, config, limit, messageOwner, await requestPictures(message, config, tags, limit));

  await reaction_loading.users.remove(client.user);
};

module.exports.help = {
  name: 'FUNC_e621_core',
};
