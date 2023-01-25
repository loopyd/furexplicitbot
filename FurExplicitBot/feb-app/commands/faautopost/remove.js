// WARN: TODO: Might be able to remove autoposts from other servers with just their channel ID

const postfacache = require('../../database/models/postfacache');

async function removeAutopost(autopostfasubmission, channelID) {
  if (!await autopostfasubmission.findOne({ where: { channelID } }).catch(ERR)) return false;
  await postfacache.destroy({ where: { channelID } }).catch(ERR);
  await autopostfasubmission.destroy({ where: { channelID } }).catch(ERR);
  return true;
}

module.exports.run = async (interaction, autopostfasubmission) => {
  const channelID = interaction.options.getString('channel', true);
  const removed = await removeAutopost(autopostfasubmission, channelID);
  if (removed) {
    messageSuccess(interaction, uwu('This channel does now no longer autopost.'));
  } else {
    messageFail(interaction, uwu('This channel ßßdoesn\'t have an autopost ßßconfigured!'));
  }
};

module.exports.data = { subcommand: true };
