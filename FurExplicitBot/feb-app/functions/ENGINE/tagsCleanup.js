const servertagsblacklist = require('../../database/models/servertagsblacklist');

module.exports = {
  data: { name: 'tagsCleanup' },
  getTags: async (serverID) => {
    const result = await servertagsblacklist.findAll({ attributes: ['tag'], where: { serverID: [serverID, config.functions.blacklistTags.managementServerID] } });
    return result;
  },
  tagsReplace: (tags, search, replace) => {
    return tags.replace(new RegExp(search, 'g'), replace);
  },
  run: async (interaction, tagsOld) => {
    let tags = tagsOld;
    const blacklistedTags = await module.exports.getTags(interaction.guild.id);
    const suffix = [];

    blacklistedTags.forEach((entry) => {
      tags = module.exports.tagsReplace(tags, ` ${entry.tag}`, '');
      suffix.push(` -${entry.tag}`);
    });
    const cleanSuffix = suffix.join('');
    return `${tags}${cleanSuffix}`;
  },
};
