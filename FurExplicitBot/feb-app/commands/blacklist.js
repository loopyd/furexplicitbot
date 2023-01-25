const servertagsblacklist = require('../database/models/servertagsblacklist');

module.exports.run = async (interaction) => {
  const subName = interaction.options.getSubcommand(true);
  if (subName !== 'list' && !interaction.memberPermissions.has('ManageGuild')) {
    messageFail(interaction, uwu('You don\'t hawe access to this command ßßòwó ßß\nYou need at least the Manage Server permission.'));
    return;
  }
  const tag = interaction.options.getString('tag');
  const tagCleanup = tag ? tag.replaceAll(' ', '_') : null;
  client.commands.get(`${module.exports.data.name}_${subName}`).run(interaction, servertagsblacklist, tagCleanup);
};

module.exports.data = new CmdBuilder()
  .setName('blacklist')
  .setDescription('Manage blacklisted tags in this server for e621 and rule34.')
  .addSubcommand((SC) => SC
    .setName('add')
    .setDescription('Add a tag to blacklist.')
    .addStringOption((option) => option
      .setName('tag')
      .setDescription('Provide a tag to add.')
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('remove')
    .setDescription('Remove a blacklisted tag.')
    .addStringOption((option) => option
      .setName('tag')
      .setDescription('Provide a tag to remove.')
      .setAutocomplete(true)
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('list')
    .setDescription('List all blacklisted tags.'));
