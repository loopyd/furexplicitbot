const { EmbedBuilder, Colors } = require('discord.js');

async function getTags(servertagsblacklist, serverID) {
  const result = await servertagsblacklist.findAll({ attributes: ['tag'], where: { serverID: [serverID, config.functions.blacklistTags.managementServerID] }, order: [['tag', 'ASC']] });
  return result;
}

module.exports.run = async (interaction, servertagsblacklist) => {
  const DBentries = await getTags(servertagsblacklist, interaction.guild.id);
  const blacklistedTags = DBentries.map((entry) => entry.tag);
  const desc = `• ${blacklistedTags.join('\n• ')}`;

  const embed = new EmbedBuilder()
    .setColor(Colors.Orange)
    .setAuthor({ name: uwu('Blacklisted tags in this server:') })
    .setDescription(desc.length >= 4000 ? `${desc.slice(0, 4000)}...\nAnd more...` : desc);
  reply(interaction, { embeds: [embed] });
};

module.exports.data = { subcommand: true };
