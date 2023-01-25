const autosourcechannel = require('../../database/models/autosourcechannel');

const autopostchannel = require('../../database/models/autopostchannel');

const postcache = require('../../database/models/postcache');

const autopostfasubmission = require('../../database/models/autopostfasubmission');

const postfacache = require('../../database/models/postfacache');

module.exports.run = async (channel) => {
  // Deletes channel and cache for autopost
  await postcache.destroy({ where: { channelID: channel.id } }).catch(ERR);
  await autopostchannel.destroy({ where: { channelID: channel.id } }).catch(ERR);

  // Deletes channel and cache for FA autopost
  await postfacache.destroy({ where: { channelID: channel.id } }).catch(ERR);
  await autopostfasubmission.destroy({ where: { channelID: channel.id } }).catch(ERR);

  // Deletes autosource channel
  autosourcechannel.destroy({ where: { channelID: channel.id } }).catch(ERR);
};

module.exports.help = {
  name: 'channelDelete',
};
