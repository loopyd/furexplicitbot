const axios = require('axios');

const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');

const IBconfig = config.engine.inkbunny;

const URLAss = (apiFunction) => `api_${apiFunction}.php`;

const sid = {};

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

const api = axios.create({
  baseURL: IBconfig.endpoint.main,
  headers: { 'User-Agent': `${config.package.name}/${config.package.version} by "Phil | Flipper#3621" on Discord` },
  // validateStatus(status) {
  //   return status >= 200 && status < 500;
  // },
});

function prepareMessage(submission) {
  const embed = new EmbedBuilder();
  // TODO: submission.mimetype = 'image/png'; check for video prefix
  const extention = submission.mimetype;
  let picURL = submission.file_url_screen;
  if (extention === 'image/gif') picURL = submission.file_url_full;
  if (!extention.startsWith('image/')) embed.addFields([{ name: 'Direct link', value: submission.file_url_full }]);

  embed
    .setColor(IBconfig.color)
    .setTitle(`Artist: ${submission.username} [InkBunny link]`)
    .setURL(`https://inkbunny.net/s/${submission.submission_id}`)
    .setImage(picURL)
    .setFooter({ text: 'Picture from inkbunny.net', iconURL: IBconfig.logo });
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

// assembles the guest login querry
async function loginAssembly() {
  const result = await api.get(URLAss('login'), { params: { username: 'guest', password: '' } });
  return result.data.sid;
}

async function ratingAssembly(sid, type = 'SFW') {
  const rating = type === 'SFW' ? 'no' : 'yes';
  const result = await api.get(URLAss('userrating'), {
    params: {
      sid,
      'tag[2]': rating,
      'tag[3]': rating,
      'tag[4]': rating,
      'tag[5]': rating,
    },
  });
  return result;
}

// checking session ID
async function checkSID() {
  if (sid.sfw && sid.nsfw) {
    // checks, if the session IDs are still valid
    [sid.sfw, sid.nsfw].forEach(async (SID) => {
      const result = await api.get(URLAss('search'), {
        params: {
          sid: SID,
          submissions_per_page: 0,
          no_submissions: 'yes',
        },
      });
      if (result.data.error_code === 2) ratingAssembly(await loginAssembly(), 'SFW');
    });
  } else {
    // generates, when first request is made
    if (!sid.sfw) {
      sid.sfw = await loginAssembly();
      ratingAssembly(sid.sfw, 'SFW');
    }
    if (!sid.nsfw) {
      sid.nsfw = await loginAssembly();
      ratingAssembly(sid.nsfw, 'NSFW');
    }
  }
}

// assembles the search querry
async function requestPictures(sid, text, submissions_per_page) {
  const type = '1,2,3,4,5,8,9';
  const result = await api.get(URLAss('search'), {
    params: {
      sid,
      text,
      submissions_per_page,
      random: 'yes',
      type,
    },
  });
  return result.data;
}

module.exports.run = async (interaction) => {
  if (!DEBUG) await interaction.deferReply();
  if (!interaction.channel.nsfw) return messageFail(interaction, uwu('This command is only available in ßßage-restricted channels.'));
  await checkSID();
  let amount = interaction.options.getNumber('amount', false) || 1;
  // provided amount checking
  if (amount < 0) amount = 1;
  if (amount > 10) {
    amount = 10;
    messageFail(interaction, uwu('You can only request a maximum of ßß10 images at the time.'), null, true);
  }
  const tags = await getTags(interaction);
  const results = await requestPictures(interaction.channel.nsfw ? sid.nsfw : sid.sfw, tags, amount);
  if (results.submissions.length === 0) return messageFail(interaction, uwu('Sorry, I found no pictures with your tags.'));
  results.submissions.forEach(async (submission) => {
    const embed = prepareMessage(submission);
    const message = await reply(interaction, { embeds: [embed], components: [buttons], fetchReply: true }, true);
    buttonHandler(interaction, message, embed, submission);
  });
};

module.exports.data = new CmdBuilder()
  .setName('inkbunny')
  .setDescription('Gewt pictures from inkbunny.')
  .addStringOption((option) => option
    .setName('tags')
    .setDescription('Lewt me knowo the twags you want to see!'))
  // TODO: see todo in resolve function
  // .setAutocomplete(true))
  // .setRequired(true))
  .addNumberOption((option) => option
    .setName('amount')
    .setDescription('A maximum o...of 10 can be prowided.'));
