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

async function requestPool(poolID, nsfw) {
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

function formatTags(tags) {
  const joinedTags = tags.replaceAll(' ', ', ');
  const cutTags = joinedTags.length > 1010 ? `${joinedTags.slice(0, 1010)}...` : joinedTags;
  return `${cutTags}`;
}

// adds all tags to embed
// DEPRECATED: rule34 doesnt split tags in their api response
function addTags(submission, poolData, embed) {
  // const artists = tags.join(', ');
  // const typeArtists = tags.artist.length === 1 ? 'Artist' : 'All artists';
  // embed.setAuthor({ name: `${typeArtists}: ${artists}`, url: `https://e621.net/posts?tags=${tags.artist[0]}` });

  embed.addFields([{ name: 'Tags', value: formatTags(submission.tags), inline: true }]);

  // TODO: need to check if poolData is null or other statement is required
  // if (poolData) {
  // embed.addFields([
  //   { name: 'Pool', value: `https://e621.net/pools/${poolData.id}`, inline: true },
  //   { name: 'Pool Name', value: poolData.name, inline: true },
  //   // TODO: orginally without ``; precautious implementation with: check if needed
  //   { name: 'Pool Page', value: `${poolData.post_ids.indexOf(submission.id) + 1}`, inline: true },
  //   { name: 'Pool last page', value: `${poolData.post_count}`, inline: true },
  // ]);
  // }
}

function prepareMessage(submission, orgMessage, poolData) {
  const embed = new EmbedBuilder();

  // addTags(submission, poolData, embed);

  // TODO: check if source can be found in a submittion endpoint
  // let source = 'none';
  // let typeSources = 'Sources';
  // if (submission.sources.length !== 0) {
  //   source = submission.sources.join('\n');
  //   if (submission.sources.length === 1) typeSources = 'Source';
  // }

  const extention = submission.file_url.substr(submission.file_url.length - 3);
  const video = extention === 'webm' || extention === 'swf' || extention === 'mp4';
  const videoPicture = video ? 'Video' : 'Picture';

  // TODO: better field implementation with map
  embed
    .setColor(orgMessage.embeds[0].color)
    .setTitle('rule34 Link')
    .setURL(`https://rule34.xxx/index.php?page=post&s=view&id=${submission.id}`)
    .setDescription(`**Tags:** \`\`\`${formatTags(submission.tags)}\`\`\``)
    .addFields([
      { name: 'Rating', value: `:regional_indicator_${submission.rating.slice(0, 1)}:`, inline: true },
      { name: 'Score', value: `${submission.score}`, inline: true },
      { name: 'ID', value: `${submission.id}`, inline: true },
      { name: 'Resolution', value: `${submission.width}x${submission.height}`, inline: true },
      { name: `Full ${videoPicture} link`, value: submission.file_url },
    ])
    // .addField(typeSources, source)
    .setImage(video ? submission.sample_url : submission.file_url)
    .setFooter({ text: `${videoPicture} from rule34.xxx`, iconURL: config.engine.rule34.logo });
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

module.exports.run = async (interaction, orgMessage, submission) => {
  // const poolData = await requestPool(submission.pools[0], interaction.channel.nsfw);
  const poolData = null;
  const embed = prepareMessage(submission, orgMessage, poolData);
  const message = await orgMessage.edit({ embeds: [embed], components: [buttons], fetchReply: true });
  buttonHandler(message, interaction, embed);
};

module.exports.data = { subcommand: true };
