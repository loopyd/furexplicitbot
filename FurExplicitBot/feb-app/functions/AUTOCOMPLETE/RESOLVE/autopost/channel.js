const autopost = require('../../../../database/controllers/autopost');

module.exports = {
  data: { name: 'channel' },
  run: async (searchInput, serverID) => {
    const DBentries = await module.exports.getChannels(serverID);
    const output = DBentries.map((entry) => {
      const channel = client.channels.cache.find((channel) => channel.id === entry.channelID);
      return { name: `#${channel.name} - ${entry.interval}ms`, value: entry.channelID };
    });
    return output;
  },
  getChannels: async (serverID) => {
    const result = await autopost.findByServerID(serverID);
    return result;
  }
};