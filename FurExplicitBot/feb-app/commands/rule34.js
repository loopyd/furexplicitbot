const axios = require('axios');

const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');

const sortList = [
  'id',
  // 'user',
  'parent',
  // 'source',
  'updated',
];

const orderList = ['desc', 'asc'];

const rand = (l) => Math.floor(Math.random() * l);

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

function getRandomItems(limit, posts) {
  const shuffled = posts.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
}

async function requestPictures(tags, limit, nsfw) {
  const sort = sortList[rand(sortList.length)];
  const order = orderList[rand(orderList.length)];
  const r34Config = config.engine.rule34;
  const postsRaw = await axios({
    method: 'GET',
    url: r34Config.endpoint.main,
    headers: { 'User-Agent': `${config.package.name}/${config.package.version} by "Phil | Flipper#3621" on Discord` },
    params: {
      tags: `${tags} sort:${sort}:${order}`,
      limit: limit * 100,
      json: 1,
      page: 'dapi',
      s: 'post',
      q: 'index',
    },
  });
  const posts = postsRaw.data;
  if (posts.length === 0) return [];
  const hardLimit = posts.length < limit ? posts.length : limit;
  const chosenPosts = getRandomItems(hardLimit, posts);
  return chosenPosts;
}

function prepareMessage(submission) {
  const embed = new EmbedBuilder();
  const extention = submission.file_url.substr(submission.file_url.length - 3);
  let picURL = submission.sample_url;
  if (extention === 'gif') picURL = submission.file_url;
  const video = extention === 'ebm' || extention === 'swf' || extention === 'mp4';
  if (video) embed.addFields([{ name: 'Direct video link', value: submission.file_url }]);

  embed
    .setColor(config.engine.rule34.color)
    .setTitle('[rule34 link]')
    .setURL(`https://rule34.xxx/index.php?page=post&s=view&id=${submission.id}`)
    .setImage(picURL)
    .setFooter({ text: `${video ? 'Video' : 'Picture'} from rule34.xxx`, iconURL: config.engine.rule34.logo });
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
    if (used.customId === 'delete') {
      if (interaction.user.id === used || !interaction.memberPermissions.has('ManageMessages')) return message.delete();
      return;
    }
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
  const results = await requestPictures(tags, amount);
  if (results.length === 0) return messageFail(interaction, uwu('Sorry, I found no pictures with your tags.'));
  results.forEach(async (submission) => {
    const embed = prepareMessage(submission);
    const message = await reply(interaction, { embeds: [embed], components: [buttons], fetchReply: true }, true);
    buttonHandler(interaction, message, embed, submission);
  });
};

module.exports.data = new CmdBuilder()
  .setName('rule34')
  .setDescription('Get pictures from rule34.')
  .addStringOption((option) => option
    .setName('tags')
    .setDescription('Lewt me knowo the twags you want to see!')
    .setAutocomplete(true))
  .addNumberOption((option) => option
    .setName('amount')
    .setDescription('A maximum o...of 10 can be prowided.'));
