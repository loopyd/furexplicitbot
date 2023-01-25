const autosourcechannel = require('../database/models/autosourcechannel');

// creates a embed messagetemplate for succeded actions
function messageSuccess(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 4296754, false);
}

// creates a embed messagetemplate for failed actions
function messageFail(message, body) {
  const client = message.client;
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false)
    .then((msg) => msg.delete({ timeout: 10000 }));
}

async function removeCheck(channelID) {
  if (!await autosourcechannel.findOne({ where: { channelID } }).catch(ERR)) return false;
  await autosourcechannel.destroy({ where: { channelID } }).catch(ERR);
  return true;
}

module.exports.run = async (client, message, args, config, EmbedBuilder, prefix) => {
  // check if user can manage servers
  if (!message.member.hasPermission('ManageGuild')) return messageFail(message, 'You dwon\'t hawe access to thwis command òwó');
  const channelID = message.channel.id;
  const added = await removeCheck(channelID);
  if (added) {
    messageSuccess(message, `<#${channelID}> has been remowed from the auto checking liwst.`);
  } else {
    messageFail(message, `<#${channelID}> is nowt on the auto checking liwst.`);
  }
};

module.exports.help = {
  name: 'CMD_autosource_remove',
  parent: 'autosource',
};
