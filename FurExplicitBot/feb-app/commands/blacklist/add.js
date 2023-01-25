const postcache = require('../../database/models/postcache');

async function addTag(servertagsblacklist, tag, serverID, managementServerID) {
  if (await servertagsblacklist.findOne({ where: { serverID: [serverID, managementServerID], tag } }).catch(ERR)) return false;
  await servertagsblacklist.findOrCreate({ where: { serverID, tag } }).catch(ERR);
  return true;
}

// clear autopost to force changes
function pruneAutopost(channelID) {
  postcache.destroy({ where: { channelID } }).catch(ERR);
}

module.exports.run = async (interaction, servertagsblacklist, tag) => {
  let tagNew = tag;
  if (tagNew.length > 30) {
    return messageFail(interaction, uwu('Your tag is too long. The maximum length is ßß30 characters.'));
  }
  const minus = tagNew.match(/^-.*/gm);
  if (minus) tagNew = tagNew.replace('-', '');
  tagNew = tagNew.replaceAll(' ', '_');
  const mgmtServer = config.functions.blacklistTags.managementServerID;
  const added = await addTag(servertagsblacklist, tagNew, interaction.guild.id, mgmtServer);
  if (added) {
    messageSuccess(interaction, uwu(`ßß\`${tagNew}\` has been added to the servers blacklist.`));
    pruneAutopost(interaction.channel.id);
  } else {
    messageFail(interaction, uwu(`ßß\`${tagNew}\` is already added to this servers backlist.`));
  }
};

module.exports.data = { subcommand: true };
