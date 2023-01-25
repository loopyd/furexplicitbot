const { Author } = require('furaffinity-api');

async function countChannels(autopostfasubmission, serverID) {
  const result = await autopostfasubmission.findAndCountAll({ where: { serverID } }).catch(ERR);
  return result.count;
}

async function addAutopost(autopostfasubmission, artistID, channelID, serverID, maxChannels) {
  if (await countChannels(autopostfasubmission, serverID) > maxChannels) return 1;
  await autopostfasubmission.findOrCreate({ where: { artistID, channelID, serverID } }).catch(ERR);
  return true;
}

module.exports.run = async (interaction, autopostfasubmission) => {
  if (!DEBUG) await interaction.deferReply({ ephemeral: true });
  const channel = await interaction.options.getChannel('channel');
  const artistID = await interaction.options.getString('artistid');
  if (!channel.nsfw) return messageFail(interaction, uwu('Please make sure your channels is marked as ßßage-restricted!'));
  // get artist catch, if not there
  const artist = await Author(artistID).catch(() => {
    messageFail(interaction, uwu(`The artist ßß${artistID} doesn't exist.\nPlease make sure you use the name from the URL while being on the artists page.`));
    return;
  });
  // check if artist is null
  if (!artist) return;
  // check, if token works
  if (artist.watchLink.endsWith('?key=')) {
    LOG('FA Token got invalidated!');
    messageFail(interaction, uwu('Woops, seems like the wizard behind the curtain has tripped! Try again later.'));
    return;
  }
  // if artist is not already watched by another channel, do so
  if (!artist.stats.watching) artist.watchAuthor();
  const added = await addAutopost(autopostfasubmission, artistID, channel.id, interaction.guild.id, config.commands.faAutopost.maxArtists);
  switch (added) {
    case true: return messageSuccess(interaction, uwu(`You are now watching ßß\`${artistID}\` in ${channel}. The first post will appear with the next uplaod of the artist.`));
    case 1: return messageFail(interaction, uwu(`You already watch the max of ßß${config.commands.faAutopost.maxArtists} artists in this server!`));
    default: return messageFail(interaction, uwu('Woops, seems like the wizard behind the curtain has tripped! Try again later.'));
  }
};

module.exports.data = { subcommand: true };
