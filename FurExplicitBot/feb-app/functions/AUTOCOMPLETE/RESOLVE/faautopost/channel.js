const autopostfasubmission = require('../../../../database/models/autopostfasubmission');

async function getChannels(serverID) {
  const result = await autopostfasubmission.findAll({ where: { serverID } });
  return result;
}

module.exports.run = async (searchInput, serverID) => {
  const DBentries = await getChannels(serverID);

  const output = DBentries.map((entry) => {
    const channel = client.channels.cache.find((channel) => channel.id === entry.channelID);
    return { name: `#${channel.name} - ${entry.artistID}`, value: entry.channelID };
  });
  return output;
};

module.exports.data = {
  name: 'channel',
};
