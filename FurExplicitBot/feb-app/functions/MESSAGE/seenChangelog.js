const seenchangelog = require('../../database/models/seenchangelog');

module.exports.run = async (interaction) => {
  const userID = interaction.user.id;
  if (!await seenchangelog.findOne({ where: { userID } })) client.commands.get('changelog').run(interaction, true).catch(ERR);
  await seenchangelog.findOrCreate({ where: { userID } }).catch(ERR);
};

module.exports.data = {
  name: 'seenChangelog',
};
