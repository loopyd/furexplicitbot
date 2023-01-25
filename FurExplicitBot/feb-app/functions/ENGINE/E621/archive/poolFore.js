const poolcache = require('../database/models/poolcache');

// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete({ timeout: 10000 }));
}

async function getPool(messageID) {
  const found = await poolcache.findAll({ where: { messageID } });
  if (!found) return null;
  return found;
}

function buildRequest(id, config, type) {
  const version = require('../package.json');
  return {
    method: 'GET',
    uri: `https://e621.net/${type}/${id}.json?login=${config.env.get('e621_login')}&api_key=${config.env.get('e621_api_key')}`,
    headers: {
      'User-Agent': `FurExplicitBot/${version.version} by Flipper on e621`,
    },
    json: true,
  };
}

async function getRequest(request) {
  const rp = require('request-promise');
  const result = await rp(request);
  return result;
}

async function requestPicture(id, config) {
  const post = await getRequest(buildRequest(id, config, 'posts'));
  return post.post;
}

function postPicture(reaction, RichEmbed, config, color, poolEntry, poolLink, poolName, lastPage, postLink) {
  const embed = new RichEmbed();

  embed
    .setColor(color)
    .setTitle('e621 Link')
    .setURL(`https://e621.net/posts/${poolEntry.postID}`)
    .addFields([
      { name: 'Pool Name', value: poolName, inline: true },
      { name: 'Pool', value: poolLink, inline: true },
      // TODO: orginally without ``; precautious implementation with: check if needed
      { name: 'Pool Page', value: `${poolEntry.poolIndex + 1}`, inline: true },
      { name: 'Pool last page', value: `${lastPage + 1}`, inline: true },
      { name: 'Full Picture link', value: postLink || 'DELETED' },
    ])
    .setImage(postLink)
    .setFooter(config.e621.label, config.e621.logo)
    .setTimestamp();

  reaction.message.edit({ embed });
}

module.exports.run = async (reaction, config, RichEmbed) => {
  // check if message is in detailed mode
  if (reaction.message.embeds.length && reaction.message.embeds[0].title === 'e621 Link') {
    // get pool link (for re-use)
    const poolLink = reaction.message.embeds[0].fields.find((header) => header.name === 'Pool').value;
    if (!poolLink) return;
    // get embed poolname (for re-use)
    const poolName = reaction.message.embeds[0].fields.find((header) => header.name === 'Pool Name').value;
    // DISABLED: cause not nessesary:
    // if (!poolName) return;
    // get color
    const color = reaction.message.embeds[0].color;
    // caclulate lastIndex
    const lastIndex = reaction.message.embeds[0].fields.find((header) => header.name === 'Pool last page').value - 1;
    // caclulate new index
    let newIndex = reaction.message.embeds[0].fields.find((header) => header.name === 'Pool Page').value - 1;
    // check if index is already at the first page
    if (newIndex !== lastIndex) ++newIndex;
    else return;
    // check DB for pool entry
    const poolData = await getPool(reaction.message.id);
    if (!poolData) return messageFail(reaction.message, 'Seewms like I tripped and lost your pool. I\'m sowwy >w< \nThis happewns, when you take too lowng. uwu');
    // get pic direct link
    const poolEntry = poolData.find((post) => post.poolIndex === newIndex);
    const post = await requestPicture(poolEntry.postID, config);
    if (!reaction.message.channel.nsfw && post.rating !== 's') return messageFail(reaction.message, 'Sowwy, but thwe next page is nsfw.');
    const postLink = post.file.url;
    // post pic
    postPicture(reaction, RichEmbed, config, color, poolEntry, poolLink, poolName, lastIndex, postLink);
  }
};

module.exports.help = {
  name: 'FUNC_e621_poolFore',
};
