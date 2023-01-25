const autosourcechannel = require('../../database/models/autosourcechannel');

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

async function addCheck(serverID, channelID) {
  if (await autosourcechannel.findOne({ where: { channelID } }).catch(ERR)) return false;
  await autosourcechannel.findOrCreate({ where: { channelID }, defaults: { serverID } }).catch(ERR);
  return true;
}

module.exports.run = async (client, message, args, config, EmbedBuilder, prefix) => {
  // check if user can manage servers
  if (!message.member.hasPermission('ManageGuild')) return messageFail(message, 'You dwon\'t hawe access to thwis command òwó');
  if (!message.channel.nsfw) return messageFail(message, 'I\'m sowwy, bwut thwis iws not yewt awailable for SFW rooms. uwu');
  const channelID = message.channel.id;
  const added = await addCheck(message.guild.id, channelID);
  if (added) {
    messageSuccess(message, `<#${channelID}> gewts now checked for sources.`);
  } else {
    messageFail(message, `<#${channelID}> gwets alreawdy checked.`);
  }
};

module.exports.help = {
  name: 'CMD_autosource_add',
  parent: 'autosource',
};
