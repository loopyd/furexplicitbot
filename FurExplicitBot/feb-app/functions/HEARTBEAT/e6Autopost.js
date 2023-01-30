const { EmbedBuilder, PermissionsBitField, Colors } = require('discord.js');

const { Op } = require('sequelize');

const autopostchannel = require('../../database/models/autopostchannel');

// const postcache = require('../database/models/postcache');

// // clear autopost to force changes
// function pruneAutopost(channelID) {
//   postcache.destroy({ where: { channelID } }).catch(ERR);
// }

async function getChannels(currentTimestamp) {
  const result = await autopostchannel.findAll({ where: { nextEvent: { [Op.lt]: currentTimestamp } } });
  // const result = await autopostchannel.findAll();
  return result;
}

function updateTime(channelID, currentTimestamp, interval) {
  const nextEvent = Number(currentTimestamp) + Number(interval);
  autopostchannel.update({ nextEvent }, { where: { channelID } });
}

function postMessage(post, channel) {
  const embed = new EmbedBuilder();
  embed
    .setColor(config.engine.e621.color)
    .setTitle(`Artist: ${post.artist} [e621 link]`)
    .setURL(`https://e621.net/posts/${post.postID}`)
    .setImage(post.directLink)
    .setFooter({ text: 'Picture from e621.net', iconURL: config.engine.e621.logo })
    .setTimestamp();
  channel.send({ embeds: [embed] });
}

// abort postingas channel is sfw
function abortMessage(channel, channelID, currentTimestamp, autoPostInterval) {
  const embed = new EmbedBuilder();
  const title = 'Hello! Your channel not marked as ßßage-restricted (NSFW).';
  const body = 'As per the newest bot update and to further comply with discords guidelines, the bot will no longer post any art in any unmarked channel. \nMake sure to adjust the setting. If you prefer to only get SFW posts, add `rating:safe` to your tags.';
  embed
    .setColor(Colors.Red)
    .setDescription(body)
    .setTitle(title);
  channel.send({ embeds: [embed] });
  updateTime(channelID, currentTimestamp, autoPostInterval);
}

async function main() {
  const currentTimestamp = new Date();
  const channels = await getChannels(currentTimestamp);
  channels.forEach(async (autoPost) => {
    const channelID = autoPost.channelID;
    const channel = client.channels.cache.find((channel) => channel.id === channelID);
    if (!channel) {
      // const shardOut = await client.shard.fetchClientValues(`channels.cache.get('${channelID}')`);
      // console.log(shardOut);
      // if (!shardOut.length) console.warn(`[${currentShardID}] ChannelID ${channelID} couldn't be found`);
      return;
    }
    // check, if bot has permission to send messages
    if (!channel.guild.members.me.permissionsIn(channel).has(new PermissionsBitField(['SendMessages', 'ViewChannel']))) {
      // DISABLED: console spam, needed to update in the future. Result of sharding
      // console.warn(`[${currentShardID}] ChannelID ${channelID} has no permissions`);
      return;
    }

    if (!channel.nsfw && !config.functions.allowSFWChannels) return abortMessage(channel, channelID, currentTimestamp, autoPost.interval);
    // const shardID = channel.guild.shardId;
    // if (currentShardID !== shardID) return;
    const post = await client.functions.get('ENGINE_E621_autopost_getPictures').run(autoPost.tags, channel.guild.id, channelID, channel.nsfw);
    // tags, channelID, nsfw
    postMessage(post, channel);
    updateTime(channelID, currentTimestamp, autoPost.interval);
  });
}

module.exports.run = () => {
  if (process.env.LOGIN_E621 && process.env.LOGIN_E621.length > 0 &&
    process.env.TOKEN_E621 && process.env.TOKEN_E621.length > 0) {
    setInterval(() => main(), config.commands.autopost.intervalChecker);
  } else {
    ERR('E621 autoposting has been disabled as LOGIN_E621_USER and TOKEN_E621 evironment variables are not set.');
  }
};

module.exports.help = {
  name: 'autopost',
};
