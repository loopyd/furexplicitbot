const autopost = require('../../../../database/controllers/autopost');

module.exports = {
  data: { name: 'faautopost' },
  run: async (searchInput, serverID) => {
    const DBentries = await autopost.findByServerIDAndType(serverID, 'fa');
    const output = DBentries.map((entry) => {
      const channel = client.channels.cache.find((channel) => channel.id === entry.channelID);
      return { name: `#${channel.name} - ${entry.artistID}`, value: entry.channelID };
    });
    return output;
  },
}