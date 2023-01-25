const axios = require('axios');

const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');

const sequelize = require('sequelize');

const personalTag = require('../../database/models/personalTag');

const buttons = new ActionRowBuilder()
  .addComponents([
    new ButtonBuilder()
      .setCustomId('like')
      .setEmoji('🔼')
      .setLabel('Smash')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('dislike')
      .setEmoji('🔽')
      .setLabel('Pass')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('ignore')
      .setEmoji('🤔')
      .setLabel('Not sure / Next')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('abort')
      .setEmoji('✖️')
      .setLabel('Abort')
      .setStyle(ButtonStyle.Danger),
  ]);

const buttonsContinue = new ActionRowBuilder()
  .addComponents([
    new ButtonBuilder()
      .setCustomId('continue')
      .setEmoji('🔀')
      .setLabel('Continue')
      .setStyle(ButtonStyle.Primary),
  ]);

async function getGate(userID) {
  const amount = await personalTag.count({
    attributes: ['score'],
    where: { userID },
    group: 'score',
  });
  let count = 0;
  let high;
  // find the high end from the bottom up --> all bad tags
  amount.forEach((group, i) => {
    const tagAmount = 2;
    // count += group.count;
    // if (count >= tagAmount && !high) high = amount[i - 1].score || 0;
    count += group.count;
    if (count >= tagAmount && isNaN(high)) {
      // this is needed, if no hits have been made in the first round
      if (group.count >= tagAmount) high = group.score - 1;
      else high = amount[i - 1].score;
    }
  });
  count = 0;
  let perm;
  // find the permanant from the top down --> all favorite tags
  amount.reverse().forEach((group, i) => {
    // const tagAmount = 20;
    const tagAmount = 2;
    count += group.count;
    if (count >= tagAmount && isNaN(perm)) {
      // this is needed, if no hits have been made in the first round
      if (group.count >= tagAmount) perm = group.score + 1;
      else perm = amount[i - 1].score;
    }
  });
  count = 0;
  let low;
  // find the low end from the top down --> all top tags
  amount.forEach((group, i) => {
    // const tagAmount = 20;
    const tagAmount = 5;
    count += group.count;
    if (count >= tagAmount && isNaN(low)) {
      // this is needed, if no hits have been made in the first round
      if (group.count >= tagAmount) low = group.score + 1;
      else low = amount[i - 1].score;
    }
  });
  // return { high, low };
  return { low, perm, high };
}

async function getTags(interaction) {
  const gate = await getGate(interaction.user.id, personalTag);
  const rawTags = await personalTag.findAll({
    attributes: ['tag', 'score'],
    where: {
      userID: interaction.user.id,
      score: {
        [sequelize.Op.or]: {
          [sequelize.Op.gte]: gate.low || 0,
          [sequelize.Op.lte]: gate.high || 0,
        },
      },
    },
    // order: [['vote', 'ASC']],
  }).catch(ERR);
  const permTags = rawTags.filter((raw) => raw.score >= gate.perm).map((raw) => raw.tag).join(' ');
  const postitiveTags = rawTags.filter((raw) => raw.score >= 0 && raw.score < gate.perm).map((raw) => `~${raw.tag}`).join(' ');
  const negativeTags = rawTags.filter((raw) => raw.score <= 0).map((raw) => `-${raw.tag}`).join(' ');
  // const tags = rawTags.map((raw) => (raw.score > 0 ? `~${raw.tag}` : `-${raw.tag}`)).join(' ');
  // const tags = rawTags.map((raw) => (raw.score > 0 ? `${raw.tag}` : `-${raw.tag}`)).join(' ');
  const safeTags = await client.functions.get('ENGINE_tagsCleanup').run(interaction, `${permTags} ${postitiveTags} ${negativeTags}`);
  return safeTags;
}

async function requestPictures(tags, nsfw) {
  const e6Config = config.engine.e621;
  const url = nsfw ? e6Config.endpoint.nsfw : e6Config.endpoint.sfw;
  const posts = await axios({
    method: 'GET',
    url,
    headers: { 'User-Agent': `${config.package.name}/${config.package.version} by Flipper on e621` },
    params: {
      tags: `${tags} order:random`,
      // FIXME: this is a hack to get 10 pictures
      limit: 10,
      login: process.env.LOGIN_E621_USER,
      api_key: process.env.TOKEN_E621,
    },
  });
  return posts.data.posts;
}

function prepareSubmissionPost(submission, tags, count) {
  const embed = new EmbedBuilder();
  const extention = submission.file.ext;
  let picURL = submission.sample.url;
  if (extention === 'gif') picURL = submission.file.url;
  if (extention === 'webm' || extention === 'swf' || extention === 'mp4') embed.addFields([{ name: 'Direct video link', value: submission.file.url }]);

  embed
    .setColor(config.engine.e621.color)
    .setTitle(`Artist: ${submission.tags.artist[0]} [e621 link]`)
    .setDescription(`${uwu('Requesting pictures with the following tags:')} \n\`\`\`${tags}\`\`\``)
    .setURL(`https://e621.net/posts/${submission.id}`)
    .setImage(picURL)
    .setFooter({ text: `Picture from e621.net | New tag-set every ${count.total} posts. Post ${count.index}/${count.total}`, iconURL: config.engine.e621.logo });
  return embed;
}

function endMessage(tags, message) {
  const embed = new EmbedBuilder();
  embed
    .setColor(config.engine.e621.color)
    .setTitle('Done!')
    .setDescription(`\`\`\`${tags}\`\`\` \n${uwu(message)}`)
    // .setDescription(`${uwu('This set:')} \n\`\`\`${tags}\`\`\` \n${uwu(message)}`)
    .setFooter({ text: 'Pictures from e621.net', iconURL: config.engine.e621.logo });
  return embed;
}

async function bulkCreateDB(userID, submission, newScore) {
  const tags = submission.tags.general
    .concat(submission.tags.species)
    .map((tag) => ({ tag, userID, score: 0 }));
  await personalTag.bulkCreate(tags, { ignoreDuplicates: true });
  tags.forEach((tagObj) => personalTag.increment(
    { score: newScore },
    {
      where: {
        userID,
        tag: tagObj.tag,
        // overflow security
        score: {
          [sequelize.Op.and]: {
            [sequelize.Op.gte]: -125,
            [sequelize.Op.lte]: 125,
          },
        },
      },
    },
  ));
}

function buttonHandler(interaction, message, orgContent, results, index, tags) {
  // start button collector
  // TODO: refactor permissions
  const filter = (i) => interaction.user.id === i.user.id || !interaction.memberPermissions.has('ManageMessages');
  const buttonCollector = message.createMessageComponentCollector({ filter, time: config.commands.buttonTimeout });
  buttonCollector.on('collect', async (used) => {
    await buttonCollector.stop();
    if (used.customId === 'abort') {
      const content = endMessage(tags, '');
      return message.edit({ embeds: [content], components: [], fetchReply: true }, true);
    }
    await used.deferUpdate();
    const newIndex = index + 1;
    // new set?
    if (used.customId !== 'continue') {
      if (newIndex >= results.length) {
        const content = endMessage(await getTags(interaction), 'Want to continue with the newly ßßevaluated set? It can only get ßßbetter...');
        const newMessage = await message.edit({ embeds: [content], components: [buttonsContinue], fetchReply: true }, true);
        buttonHandler(interaction, newMessage, orgContent, results, 0, tags);
        return;
      }
      // post next index
      const embed = prepareSubmissionPost(results[newIndex], tags, { index: newIndex, total: results.length });
      const newMessage = await message.edit({ embeds: [embed], components: [buttons], fetchReply: true }, true);
      buttonHandler(interaction, newMessage, embed, results, newIndex, tags);
    }
    // continue button handler
    const userID = interaction.user.id;
    switch (used.customId) {
      case 'continue': return module.exports.run(interaction);
      case 'like': return bulkCreateDB(userID, results[index], 1);
      case 'dislike': return bulkCreateDB(userID, results[index], -1);
      default: return;
    }
  });
  buttonCollector.on('end', async (collected) => {
    if (collected.size === 0) message.edit({ embeds: [orgContent], components: [] });
  });
}

async function newInstance(interaction, results, tags, message) {
  const embed = prepareSubmissionPost(results[0], tags, { index: '1', total: results.length });
  let newMessage;
  const content = { embeds: [embed], components: [buttons], fetchReply: true };
  if (message) newMessage = await message.edit(content, true);
  else newMessage = await reply(interaction, content);
  const count = await personalTag.count({ where: { userID: interaction.user.id } });
  if (count === 0) reply(interaction, '__Placeholder privacy notice__: By continue using this command, you agree, that we store tag-information about your e621 browsing behavior. To remove the stored data at any time, press "Abort" and run `/suggest reset`.', true);
  buttonHandler(interaction, newMessage, embed, results, 0, tags);
}

module.exports.run = async (interaction) => {
  const tags = await getTags(interaction);
  const results = await requestPictures(tags, interaction.channel.nsfw);
  if (results.length === 0) return messageFail(interaction, uwu('Sorry, I found no pictures with your tags.'));
  newInstance(interaction, results, tags);
};

module.exports.data = { subcommand: true };
