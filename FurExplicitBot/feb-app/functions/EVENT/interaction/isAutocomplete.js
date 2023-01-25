module.exports.run = async (interaction) => {
  const commandName = interaction.commandName.replace('_dev', '');
  return client.functions.get(`AUTOCOMPLETE_${commandName}`).run(interaction).catch(ERR);
};

module.exports.data = {
  name: 'isAutocomplete',
};
