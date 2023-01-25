const autopostchannel = require('../../../../database/models/autopostchannel');

async function getChannels(serverID) {
  const result = await autopostchannel.findAll({ where: { serverID } });
  return result;
}

module.exports.run = async (searchInput, serverID) => {
  const DBentries = await getChannels(serverID);

  const output = DBentries.map((entry) => {
    const channel = client.channels.cache.find((channel) => channel.id === entry.channelID);
    return { name: `#${channel.name} - ${entry.interval}ms`, value: entry.channelID };
  });
  return output;
};

module.exports.data = {
  name: 'channel',
};
