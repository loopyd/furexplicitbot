const servertagsblacklist = require('../../database/models/servertagsblacklist');

async function getTags(serverID) {
  const result = await servertagsblacklist.findAll({ attributes: ['tag'], where: { serverID: [serverID, config.functions.blacklistTags.managementServerID] } });
  return result;
}

function tagsReplace(tags, search, replace) {
  return tags.replace(new RegExp(search, 'g'), replace);
}

module.exports.run = async (interaction, tagsOld) => {
  let tags = tagsOld;
  const blacklistedTags = await getTags(interaction.guild.id);
  const suffix = [];

  blacklistedTags.forEach((entry) => {
    tags = tagsReplace(tags, entry.tag, '');
    // users where trying to forbid the fobidden tags again, causing this issue
    suffix.push(` -${entry.tag}`);
  });
  tags = tags.replaceAll('- ');
  const cleanSuffix = suffix.join('');
  return `${tags}${cleanSuffix}`;
};

module.exports.help = {
  name: 'tagsCleanup',
};
