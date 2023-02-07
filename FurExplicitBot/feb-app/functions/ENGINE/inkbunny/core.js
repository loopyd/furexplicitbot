const axios = require('axios');

// Since inkbunny has made reform on blocking cub(only 9 % of site containing it),
// we have renabled the module but added additional protection.
//
// If discord wants us to depending on the way the site goes we may have to disable
// it again in the future so stay tuned.

module.exports = {
  data: { name: 'inkbunny' },
  messageBuilder: (config, EmbedBuilder, title, url, image) => {
    return new EmbedBuilder()
      .setTitle(title)
      .setURL(url)
      .setImage(image)
      .setColor(config.ib.color)
      .setFooter('Inkbunny', config.ib.logo)
      .setTimestamp();
  },
  noteSend: async (message, channel, EmbedBuilder) => {
    const embed = new EmbedBuilder().setDescription(message);
    await channel.send({ embed }).catch(ERR);
  },
  messageSend: async (config, message, EmbedBuilder, result) => {
    result.submissions.forEach(async (submission) => {
      const url = `https://inkbunny.net/s/${submission.submission_id}`;
      const title = `Artist: ${submission.username} [Inkbunny link]`;
      const embed = module.exports.messageBuilder(config, EmbedBuilder, title, url, submission.file_url_full);
      await message.channel.send({ embed })
        .then((sentMessage) => sentMessage.react('❌')).catch(ERR);
    });
  },
  httpRequest: async (apiFunction, args) => {
    const result = await axios({
      method: 'GET',
      url: `https://inkbunny.net/api_${apiFunction}.php`,
      headers: { 'User-Agent': `${config.package.name}/${config.package.version} by ${config.package.author} on GitHub` },
      params: { 'output_mode': 'json', ...args },
      json: true,
    }).catch(ERR);
    return result;
  },
  loginAssembly: async () => {
    const result = await module.exports.httpRequest('login', {
      username: 'guest',
      password: '',
    }).catch(ERR);
    return result.sid;
  },
  SFWRatingAssembly: async (sid) => {
    let result = await module.exports.httpRequest('userrating', {
      sid: `${sid}`,
      tag: ['yes', 'yes', 'no', 'no', 'no', 'no'],
    }).catch(ERR);
    return;
  },
  NSFWRatingAssembly: async (sid) => {
    let result = await module.exports.httpRequest('userrating', {
      sid: `${sid}`,
      tag: ['yes', 'yes', 'yes', 'yes', 'yes', 'yes'],
    }).catch(ERR);
    return;
  },
  checkChannelRating: (client, channel) => {
    const sidSFW = client.IB_SID_SFW;
    const sidNSFW = client.IB_SID_NSFW;
    switch (channel.nsfw) {
      case true: return sidNSFW;
      case false: return sidSFW;
      default: return sidSFW;
    }
  },
  limiter: async (amount, config, message, EmbedBuilder) => {
    let newAmount = amount;
    if (amount > 10 && message.author.id !== config.owner) {
      await module.exports.noteSend(uwu('You can only requwest a maximum of 10 images at a time.'), message.channel, EmbedBuilder);
      newAmount = 10;
    }
    return newAmount;
  },
  searchAssembly: async (sid, searchQuery, amount) => {
    const result = await module.exports.httpRequest('search', {
      sid: `${sid}`,
      text: `${searchQuery}`,
      postTypes: [1, 2, 3, 4, 5, 8, 9],
      submissions_per_page: `${amount}`,
      random: 'yes',
      type: `${postTypes}`,
    });
    return result;
  },
  checkSID: async (client) => {
    if (client.IB_SID_SFW && client.IB_SID_NSFW) {
      [client.IB_SID_SFW, client.IB_SID_NSFW].forEach(async (SID) => {
        const result = await module.exports.httpRequest('search', {
          sid: `${SID}`,
          submissions_per_page: '0',
          no_submissions: 'yes',
        }).catch(ERR);
        if (result.error_code === 2) {
          SID = await module.exports.loginAssembly();
          await module.exports.SFWRatingAssembly(SID);
        }
      });
    } else {
      // generates, when first request is made
      if (!client.IB_SID_SFW) {
        client.IB_SID_SFW = await module.exports.loginAssembly();
        await module.exports.SFWRatingAssembly(client.IB_SID_SFW).catch(ERR);
      }
      if (!client.IB_SID_NSFW) {
        client.IB_SID_NSFW = await module.exports.loginAssembly();
        await module.exports.NSFWRatingAssembly(client.IB_SID_NSFW).catch(ERR);
      }
    }
  },
  editorNote: async (message, EmbedBuilder) => {
    const note = '**Editor note:** This command is still in beta. There are going to be features added soon. In the meantime, you might experience long image waiting times.';
    await module.exports.noteSend(note, message.channel, EmbedBuilder);
  },
  run: async (client, message, args, config, EmbedBuilder, messageOwner) => {
    await module.exports.editorNote(message, EmbedBuilder);
    await module.exports.checkSID(client);
    // getting loading emoji
    const loadingEmoji = client.guilds.cache.get(config.emoji.serverID).emojis.cache.get(config.emoji.loading);
    await message.react(loadingEmoji).then(async (reaction_loading) => {
      // checking for requested ammounts of pictures and parses tags
      let tags = args.join(' ');
      let [ammount] = args;
      if (isNaN(ammount) || ammount <= 0) ammount = 1;
      else tags = tags.slice(ammount.length + 1);
      const result = await module.exports.searchAssembly(
        await module.exports.checkChannelRating(client, message.channel),
        tags,
        module.exports.limiter(ammount, config, message, EmbedBuilder),
      );
      await module.exports.messageSend(config, message, EmbedBuilder, result);
      await reaction_loading.users.remove(client.user);
    }).catch(async (err) => {
        await message.channel.send(uwu('It seems that something went wrong.  Please report this to my developer.')).then(() => message.react('❌'));
        ERR(err);
      });
  },
};