const axios = require('axios');

async function countChannels(autopostchannel, serverID) {
  const result = await autopostchannel.findAndCountAll({ where: { serverID } }).catch(ERR);
  return result.count;
}

async function addAutopost(autopostchannel, tags, interval, channelID, serverID, maxChannels) {
  const date = new Date();
  const nextEvent = date.getTime();
  if (await countChannels(autopostchannel, serverID) > maxChannels) return 1;
  if (await autopostchannel.findOne({ where: { channelID } }).catch(ERR)) return 2;
  await autopostchannel.findOrCreate({
    where: { channelID },
    defaults: {
      tags, serverID, interval, nextEvent,
    },
  }).catch(ERR);
  return true;
}

function tagsReplace(tags, search, replace) {
  return tags.replace(new RegExp(search, 'g'), replace);
}

function parseTags(tags) {
  // tags = tagsReplace(tags, ', ', ' ');
  // const safeTags = await message.client.functions.get('FUNC_tagsCleanup').run(message, tags);
  // return safeTags;
  return tagsReplace(tags, ', ', ' ');
}

async function getAmmount(request) {
  const pics = await axios(request);
  return pics.data.posts.length;
}

function getEndpoint(nsfw, config) {
  let uri = config.engine.e621.endpoint.sfw;
  if (nsfw) uri = config.engine.e621.endpoint.nsfw;
  return uri;
}

function buildRequest(url) {
  return {
    method: 'GET',
    url,
    headers: { 'User-Agent': `FurExplicitBot/${config.package.version} by Flipper on e621` },
    json: true,
  };
}

async function checkAmmount(config, tags, nsfw) {
  const endpoint = getEndpoint(nsfw, config);
  const url = `${endpoint}?tags=${tags} order:random&limit=${config.commands.autopost.maxCache}&login=${process.env.LOGIN_E621_USER}&api_key=${process.env.TOKEN_E621}`;
  const ammount = await getAmmount(buildRequest(url));
  const result = ammount < config.commands.autopost.minPics;
  return result;
}

module.exports.run = async (interaction, autopostchannel) => {
  if (!DEBUG) await interaction.deferReply({ ephemeral: true });
  const channel = await interaction.options.getChannel('channel');
  const tags = parseTags(await interaction.options.getString('tags'));
  const interval = await interaction.options.getNumber('interval');
  if (!channel.nsfw) return messageFail(interaction, uwu('Please make sure your channels is marked as ßßage-restricted!'));
  // checksthe intervall ammount is in the limits
  if (interval > config.commands.autopost.maxPostTime || interval < config.commands.autopost.minPostTime) {
    return messageFail(interaction, uwu(`Interval needs to be between ßß${config.commands.autopost.minPostTime}ms and ßß${config.commands.autopost.maxPostTime}ms.`));
  }
  if (tags.length > 255) {
    return messageFail(interaction, uwu('Your tags are too long. The maximum length is 255 characters.'));
  }
  if (await checkAmmount(config, tags, channel.nsfw)) {
    return messageFail(interaction, uwu(`Your provided tags don't return the minimum ammount of ßß${config.commands.autopost.maxCache} posts. Try setting simpler tags or mark your channel as nsfw.`));
  }
  const added = await addAutopost(autopostchannel, tags, interval, channel.id, interaction.guild.id, config.commands.autopost.maxChannels);
  switch (added) {
    case true:
      const tagsDisplay = await interaction.client.functions.get('ENGINE_tagsCleanup').run(interaction, tags);
      return messageSuccess(interaction, uwu(`Your autopost with the tags ßß\`${tagsDisplay.split(' ').join(' ßß')}\` has been created. The first post will appear soon.`));
    case 1: return messageFail(interaction, uwu(`You already have ßß${config.commands.autopost.maxChannels} autopost channels in this server!`));
    case 2: return messageFail(interaction, uwu('You are already using this channel as an autopost channel!'));
    default: return messageFail(interaction, uwu('Woops, seems like the wizard behind the curtain has tripped! Try again later.'));
  }
};

module.exports.data = { subcommand: true };
