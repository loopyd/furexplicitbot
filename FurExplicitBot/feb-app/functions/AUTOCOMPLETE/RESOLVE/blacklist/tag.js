const tags = require('../../../../database/controllers/tags');

module.exports.run = async (searchInput, serverID) => {
  const DBentries = await tags.servertagsblacklist.findByID(serverID);
  if (!DBentries) return [];
  const output = DBentries.map((entry) => ({ name: entry.tag, value: `${entry.id}` }));
  return output;
};

module.exports.data = {
  name: 'tag',
};
