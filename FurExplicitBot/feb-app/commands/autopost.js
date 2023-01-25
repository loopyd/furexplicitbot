const autopostchannel = require('../database/models/autopostchannel');

const servertagsblacklist = require('../database/models/servertagsblacklist');

module.exports.run = async (interaction) => {
  const subName = interaction.options.getSubcommand(true);
  if (subName !== 'list' && !interaction.memberPermissions.has('ManageGuild')) {
    messageFail(interaction, uwu('You don\'t hawe access to this command ßßòwó ßß\nYou need at least the Manage Server permission.'));
    return;
  }
  client.commands.get(`${module.exports.data.name}_${subName}`).run(interaction, autopostchannel, servertagsblacklist);
};

module.exports.data = new CmdBuilder()
  .setName('autopost')
  .setDescription('Autopost e621 pictures in a channel.')
  .addSubcommand((SC) => SC
    .setName('add')
    .setDescription('Add a new autopost chwannel.')
    .addChannelOption((option) => option
      .setName('channel')
      .setDescription('Prowide a channel you mwe to post in.')
      .addChannelTypes(0)
      .setRequired(true))
    .addStringOption((option) => option
      .setName('tags')
      .setDescription('Lewt  me knowo the twags you want to see!')
      .setAutocomplete(true)
      .setRequired(true))
    .addNumberOption((option) => option
      .setName('interval')
      .setDescription(`The interval in milliseconds. (Nweeds to be between ${config.commands.autopost.minPostTime}ms and ${config.commands.autopost.maxPostTime}ms.)`)
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('remove')
    .setDescription('Remove a autopost channel.')
    .addStringOption((option) => option
      .setName('channel')
      .setDescription('Provide a autopost to remove.')
      .setAutocomplete(true)
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('list')
    .setDescription('List all autopost channels.'));
