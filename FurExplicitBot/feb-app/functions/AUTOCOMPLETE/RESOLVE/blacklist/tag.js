const servertagsblacklist = require('../../../../database/models/servertagsblacklist');

async function getTags(serverID) {
  const result = await servertagsblacklist.findAll({ attributes: ['id', 'tag'], where: { serverID }, order: [['tag', 'ASC']] });
  return result;
}

module.exports.run = async (searchInput, serverID) => {
  const DBentries = await getTags(serverID);

  const output = DBentries.map((entry) => ({ name: entry.tag, value: `${entry.id}` }));
  return output;
};

module.exports.data = {
  name: 'tag',
};
