const rp = require('request-promise');

// prepares message embed
function messageBuilder(config, EmbedBuilder, title, url, image) {
  return new EmbedBuilder()
    .setTitle(title)
    .setURL(url)
    .setImage(image)
    .setColor(config.ib.color)
    .setFooter('Inkbunny', config.ib.logo)
    .setTimestamp();
}

// sends note
function noteSend(message, channel, EmbedBuilder) {
  const embed = new EmbedBuilder().setDescription(message);
  channel.send({ embed });
}

// prepares message values and sends
function messageSend(config, message, EmbedBuilder, result) {
  result.submissions.forEach((submission) => {
    const url = `https://inkbunny.net/s/${submission.submission_id}`;
    const title = `Artist: ${submission.username} [Inkbunny link]`;
    const embed = messageBuilder(config, EmbedBuilder, title, url, submission.file_url_full);
    message.channel.send({ embed })
      .then((sentMessage) => sentMessage.react('❌'));
  });
}

// runs http request
async function httpRequest(apiFunction, args) {
  const uri = `https://inkbunny.net/api_${apiFunction}.php?output_mode=json&${args}`;
  const request = {
    method: 'GET',
    uri,
    headers: { 'User-Agent': 'DiscordBot - FurExplicitBot' },
    json: true,
  };
  const result = await rp(request);
  return result;
}

// assembles the guest login querry
async function loginAssembly() {
  const args = 'username=guest&password=';
  const result = await httpRequest('login', args);
  return result.sid;
}

// assembles the SFW search querry
function SFWRatingAssembly(sid) {
  const args = `sid=${sid}&tag[2]=no&tag[3]=no&tag[4]=no&tag[5]=no`;
  httpRequest('userrating', args);
}

// assembles the NSFW search querry
function NSFWRatingAssembly(sid) {
  const args = `sid=${sid}&tag[2]=yes&tag[3]=yes&tag[4]=yes&tag[5]=yes`;
  httpRequest('userrating', args);
}

// checking if channel is nsfw
function checkChannelRating(client, channel) {
  const sidSFW = client.IB_SID_SFW;
  const sidNSFW = client.IB_SID_NSFW;
  switch (channel.nsfw) {
    case true: return sidNSFW;
    case false: return sidSFW;
    default: return sidSFW;
  }
}

function limmiter(ammount, config, message, EmbedBuilder) {
  let newAmmount = ammount;
  if (ammount > 10 && message.author.id !== config.owner) {
    const note = 'You can only requwest a maximum of 10 images at the twime. I hawe limited it fowor you ^w^';
    noteSend(note, message.channel, EmbedBuilder);
    newAmmount = 10;
  }
  return newAmmount;
}

// assembles the search querry
async function seachAssembly(sid, searchQuery, ammount) {
  const postTypes = '1,2,3,4,5,8,9';
  const args = `sid=${sid}&text=${searchQuery}&submissions_per_page=${ammount}&random=yes&type=${postTypes}`;
  const result = await httpRequest('search', args);
  return result;
}

// checking session ID
async function checkSID(client) {
  if (client.IB_SID_SFW && client.IB_SID_NSFW) {
    [client.IB_SID_SFW, client.IB_SID_NSFW].forEach(async (SID) => {
      const args = `sid=${SID}&submissions_per_page=0&no_submissions=yes`;
      const result = await httpRequest('search', args);
      if (result.error_code === 2) {
        SID = await loginAssembly();
        SFWRatingAssembly(SID);
      }
    });
  } else {
    // generates, when first request is made
    if (!client.IB_SID_SFW) {
      client.IB_SID_SFW = await loginAssembly();
      SFWRatingAssembly(client.IB_SID_SFW);
    }
    if (!client.IB_SID_NSFW) {
      client.IB_SID_NSFW = await loginAssembly();
      NSFWRatingAssembly(client.IB_SID_NSFW);
    }
  }
}

// TEMP: Editor note
function editorNote(message, EmbedBuilder) {
  const note = '**Editor note:** This command is still in beta. There are going to be features added soon. In the meantime, you might experience long image waiting times.';
  noteSend(note, message.channel, EmbedBuilder);
}

module.exports.run = async (client, message, args, config, EmbedBuilder, messageOwner) => {
  editorNote(message, EmbedBuilder);
  await checkSID(client);
  // getting loading emoji
  const loadingEmoji = client.guilds.cache.get(config.emoji.serverID).emojis.cache.get(config.emoji.loading);
  message.react(loadingEmoji).then(async (reaction_loading) => {
    // checking for requested ammounts of pictures and parses tags
    let tags = args.join(' ');
    let [ammount] = args;
    if (isNaN(ammount) || ammount <= 0) ammount = 1;
    else tags = tags.slice(ammount.length + 1);
    const result = await seachAssembly(
      await checkChannelRating(client, message.channel),
      tags,
      limmiter(ammount, config, message, EmbedBuilder),
    );
    messageSend(config, message, EmbedBuilder, result);
    await reaction_loading.users.remove(client.user);
  })
    .catch((err) => {
      message.channel.send('Sowwy, but it seems like something went wrong... Pleawse report this to my creator. uwu\'')
        .then(() => message.react('❌'));
      console.error(err);
    });
};

module.exports.help = {
  name: 'FUNC_inkbunny_core',
};
