// TODO: better implementation of duplicate code

module.exports = {
  data: { name: 'faautopost' },
  run: async (interaction) => {
    // check manage guild permissions
    if (!interaction.memberPermissions.has('ManageGuild')) {
      interaction.respond([{ name: uwu(`You don't hawe access to ßß/${module.exports.data.name} ßßòwó ßß\nYou need at least the Manage Server permission.`), value: '0' }]);
      return;
    }

    const command = interaction.options.getFocused(true);
    const guildID = interaction.guild.id;
    const response = await client.functions.get(`AUTOCOMPLETE_RESOLVE_${module.exports.data.name}_${command.name}`).run(command.value, guildID).catch(ERR);
    return interaction.respond(response);
  },
};
