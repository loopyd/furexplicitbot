const { Browse } = require('furaffinity-api');

const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');

const buttons = new ActionRowBuilder()
  .addComponents([
    new ButtonBuilder()
      .setCustomId('delete')
      .setEmoji('✖️')
      .setLabel('Delete')
      .setStyle(ButtonStyle.Danger),
  ]);

function prepareMessage(submission) {
  const faConfig = config.engine.furaffinity;
  const embed = new EmbedBuilder()
    .setAuthor({ name: submission.author.name, url: submission.author.url })
    .setColor(faConfig.color)
    .setTitle(`${submission.title} [Link]`)
    .setURL(submission.url)
    .addFields([{ name: 'Preview', value: '🔽' }])
    .setImage(submission.thumb.large)
    .setFooter({ text: 'Picture from FurAffinity.net', icon_url: faConfig.color });
  return embed;
}

function buttonHandler(message, interaction, orgContent) {
  // start button collector
  const filter = (i) => interaction.user.id === i.user.id || !interaction.memberPermissions.has('ManageMessages');
  const buttonCollector = message.createMessageComponentCollector({ filter, time: config.commands.buttonTimeout });
  buttonCollector.on('collect', async (used) => {
    buttonCollector.stop();
    if (used.customId === 'delete') return message.delete();
  });
  buttonCollector.on('end', async (collected) => {
    if (collected.size === 0) message.edit({ embeds: [orgContent], components: [] });
  });
}

module.exports.run = async (interaction, rating) => {
  let amount = interaction.options.getNumber('amount', false) || 1;
  if (amount < 0) amount = 1;
  if (amount > 24) {
    amount = 24;
    messageFail(interaction, uwu('You can only request a maximum of ßß24 images at the time.'), null, true);
  }
  const pics = await Browse({ perpage: 24, rating });
  pics.reverse().slice(-amount).forEach(async (submission) => {
    const embed = prepareMessage(submission);
    const message = await reply(interaction, { embeds: [embed], components: [buttons], fetchReply: true }, true);
    buttonHandler(message, interaction, embed);
  });
};

module.exports.data = { subcommand: true };
