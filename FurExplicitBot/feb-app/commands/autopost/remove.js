// WARN: TODO: Might be able to remove autoposts from other servers with just their channel ID

const postcache = require('../../database/models/postcache');

async function removeAutopost(autopostchannel, channelID) {
  if (!await autopostchannel.findOne({ where: { channelID } }).catch(ERR)) return false;
  await postcache.destroy({ where: { channelID } }).catch(ERR);
  await autopostchannel.destroy({ where: { channelID } }).catch(ERR);
  return true;
}

module.exports.run = async (interaction, autopostchannel) => {
  const channelID = interaction.options.getString('channel', true);
  const removed = await removeAutopost(autopostchannel, channelID);
  if (removed) {
    messageSuccess(interaction, uwu('This channel does now no longer autopost.'));
  } else {
    messageFail(interaction, uwu('This channel ßßdoesn\'t have an autopost ßßconfigured!'));
  }
};

module.exports.data = { subcommand: true };
