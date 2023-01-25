const { Login } = require('furaffinity-api');

Login(process.env.LOGIN_FA_COOKIE_A, process.env.LOGIN_FA_COOKIE_B);

const autopostfasubmission = require('../database/models/autopostfasubmission');

module.exports.run = async (interaction) => {
  const subName = interaction.options.getSubcommand(true);
  if (subName !== 'list' && !interaction.memberPermissions.has('ManageGuild')) {
    messageFail(interaction, uwu('You don\'t hawe access to this command ßßòwó ßß\nYou need at least the Manage Server permission.'));
    return;
  }
  client.commands.get(`${module.exports.data.name}_${subName}`).run(interaction, autopostfasubmission);
};

module.exports.data = new CmdBuilder()
  .setName('faautopost')
  .setDescription('Post new FurAffinity submissions in a channel.')
  .addSubcommand((SC) => SC
    .setName('add')
    .setDescription('Add a new autopost chwannel.')
    .addChannelOption((option) => option
      .setName('channel')
      .setDescription('Prowide a channel you mwe to post in.')
      .addChannelTypes(0)
      .setRequired(true))
    .addStringOption((option) => option
      .setName('artistid')
      .setDescription('Lewt me knowo the awrtist you want to see!')
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
