const axios = require('axios');

const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');

const buttons = new ActionRowBuilder()
  .addComponents([
    new ButtonBuilder()
      .setCustomId('details')
      .setEmoji('📖')
      // .setEmoji(client.guilds.cache.get(config.customEmoji.serverID).emojis.cache.get(config.customEmoji.emoji.details))
      .setLabel('Show details')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('delete')
      .setEmoji('✖️')
      .setLabel('Delete')
      .setStyle(ButtonStyle.Danger),
  ]);

async function getTags(interaction) {
  const tagsRaw = interaction.options.getString('tags', false) || '';
  const tags = tagsRaw.replaceAll(', ', ' ');
  const safeTags = await interaction.client.functions.get('ENGINE_tagsCleanup').run(interaction, tags);
  return safeTags;
}

async function requestPictures(tags, limit, nsfw) {
  const e6Config = config.engine.e621;
  const url = nsfw ? e6Config.endpoint.nsfw : e6Config.endpoint.sfw;
  const posts = await axios({
    method: 'GET',
    url,
    headers: { 'User-Agent': `${config.package.name}/${config.package.version} by Flipper on e621` },
    params: {
      tags: `${tags} order:random`,
      limit,
      login: process.env.LOGIN_E621_USER,
      api_key: process.env.TOKEN_E621,
    },
  });
  return posts.data.posts;
}

function prepareMessage(submission) {
  const embed = new EmbedBuilder();
  const extention = submission.file.ext;
  let picURL = submission.sample.url;
  if (extention === 'gif') picURL = submission.file.url;
  const video = extention === 'webm' || extention === 'swf' || extention === 'mp4';
  if (video) embed.addFields([{ name: 'Direct video link', value: submission.file.url }]);

  embed
    .setColor(config.engine.e621.color)
    .setTitle(`Artist: ${submission.tags.artist[0]} [e621 link]`)
    .setURL(`https://e621.net/posts/${submission.id}`)
    .setImage(picURL)
    .setFooter({ text: `${video ? 'Video' : 'Picture'} from e621.net`, iconURL: config.engine.e621.logo });
  return embed;
}

function buttonHandler(interaction, message, orgContent, submission) {
  // start button collector
  const filter = (i) => interaction.user.id === i.user.id || !interaction.memberPermissions.has('ManageMessages');
  const buttonCollector = message.createMessageComponentCollector({ filter, time: config.commands.buttonTimeout });
  buttonCollector.on('collect', async (used) => {
    await used.deferUpdate();

    // TODO: check if collector should be stopped; check permission management
    buttonCollector.stop();
    // TODO: not sure what was planned with the below function, but it broke delete funciton.
    if (used.customId === 'delete') return message.delete();
    // if (used.customId === 'delete') {
    //   if (interaction.user.id === used || !interaction.memberPermissions.has('ManageMessages')) return message.delete();
    //   return;
    // }
    client.commands.get(`${module.exports.data.name}_COMPONENT_button_${used.customId}`).run(interaction, message, submission);
  });
  buttonCollector.on('end', async (collected) => {
    if (collected.size === 0) message.edit({ embeds: [orgContent], components: [] });
  });
}

// TODO: disable button if in timeout; check if last page of comic beforehand

module.exports.run = async (interaction) => {
  if (!DEBUG) await interaction.deferReply();
  if (!interaction.channel.nsfw) return messageFail(interaction, uwu('This command is only available in ßßage-restricted channels.'));
  let amount = interaction.options.getNumber('amount', false) || 1;
  // provided amount checking
  if (amount < 0) amount = 1;
  if (amount > 10) {
    amount = 10;
    messageFail(interaction, uwu('You can only request a maximum of ßß10 images at the time.'), null, true);
  }
  const tags = await getTags(interaction);
  const results = await requestPictures(tags, amount, interaction.channel.nsfw);
  if (results.length === 0) return messageFail(interaction, uwu('Sorry, I found no pictures with your tags.'));
  results.forEach(async (submission) => {
    const embed = prepareMessage(submission);
    const message = await reply(interaction, { embeds: [embed], components: [buttons], fetchReply: true }, true);
    buttonHandler(interaction, message, embed, submission);
  });
};

module.exports.data = new CmdBuilder()
  .setName('e621')
  .setDescription('Get pictures from e621.')
  .addStringOption((option) => option
    .setName('tags')
    .setDescription('Lewt me knowo the twags you want to see!')
    .setAutocomplete(true))
  // .setRequired(true))
  .addNumberOption((option) => option
    .setName('amount')
    .setDescription('A maximum o...of 10 can be prowided.'));
