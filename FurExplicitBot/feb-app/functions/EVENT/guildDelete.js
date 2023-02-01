const servertagsblacklist = require('../../database/models/servertagsblacklist');

const autosourcechannel = require('../../database/models/autosourcechannel');

const postcache = require('../../database/models/postcache');

const autopostfasubmission = require('../../database/models/autopostfasubmission');

const postfacache = require('../../database/models/postfacache');

const configcontroller = require('../../database/controllers/config');

module.exports.run = async (guild) => {
  // Deletes all blacklisted tags
  servertagsblacklist.destroy({ where: { serverID: guild.id } }).catch(ERR);

  // Deletes all autosource channels
  autosourcechannel.destroy({ where: { serverID: guild.id } }).catch(ERR);

  // Delets bot config for server
  configcontroller.destroy(guild.id, null).catch(ERR);

  // Deletes all channels and cache for autopost
  const autoChannelEntries = await autopostchannel.findAll({ where: { serverID: guild.id } }).catch(ERR);
  await autoChannelEntries.forEach((entry) => postcache.destroy({ where: { channelID: entry.channelID } }).catch(ERR));
  await autopostchannel.destroy({ where: { serverID: guild.id } }).catch(ERR);

  // Deletes all channels and cache for FA autopost
  const FAautoChannelEntries = await autopostfasubmission.findAll({ where: { serverID: guild.id } }).catch(ERR);
  await FAautoChannelEntries.forEach((entry) => postfacache.destroy({ where: { channelID: entry.channelID } }).catch(ERR));
  await FAautopostchannel.destroy({ where: { serverID: guild.id } }).catch(ERR);
};

module.exports.data = {
  name: 'guildDelete',
};
