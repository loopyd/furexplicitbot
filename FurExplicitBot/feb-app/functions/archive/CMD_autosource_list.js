// const config = require('../config/main.json');

// const autosourcechannel = require('../database/models/autosourcechannel');

async function getCheck(serverID) {
  const result = await autosourcechannel.findAll({ attributes: ['channelID'], where: { serverID } });
  return result;
}

module.exports.run = async (client, message, args, config, EmbedBuilder, prefix) => {
  const DBentries = await getCheck(message.guild.id);
  const enabledChannels = [];
  DBentries.forEach((entry) => {
    enabledChannels.push(entry.channelID);
  });
  const embed = new EmbedBuilder()
    .setColor(message.member.displayColor)
    .setAuthor('Auto source channels in thwis serwer:')
    .setDescription(`<#${enabledChannels.join('>, <#')}>`);
  message.channel.send({ embed });
};

module.exports.help = {
  name: 'CMD_autosource_list',
  parent: 'autosource',
};
