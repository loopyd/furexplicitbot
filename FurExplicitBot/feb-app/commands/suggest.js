const personalTag = require('../database/models/personalTag');

module.exports.run = async (interaction) => {
  if (!DEBUG) await interaction.deferReply();
  if (!interaction.channel.nsfw) return messageFail(interaction, uwu('This command is only available in ßßage-restricted channels.'));

  const subName = interaction.options.getSubcommand(true);
  client.commands.get(`${module.exports.data.name}_${subName}`).run(interaction, personalTag);
};

module.exports.data = new CmdBuilder()
  .setName('suggest')
  .setDescription('I\'m going to try and guess what you want.')
  .addSubcommand((SC) => SC
    .setName('start')
    .setDescription('Start the game!'))
  // .addSubcommand((SC) => SC
  //   .setName('hint')
  //   .setDescription('Sowwy, im bad at this >.< Mind giwing me a hint?')
  //   .addStringOption((option) => option
  //     .setName('tag')
  //     .setDescription('The twag will the prioritized.')
  //     .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('reset')
    .setDescription('Went to far into a rabbit hole?  You can reset here!'));
