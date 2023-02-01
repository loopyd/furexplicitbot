module.exports.run = async (interaction) => {
    if (!interaction.memberPermissions.has('ManageChannels')) {
        messageFail(interaction, uwu('You don\'t hawe access to this command.\nYou need at least the Manage Channels permission.'));
        return;
    }
    const subName = interaction.options.getSubcommand(true);
    if (subName == 'set') {
        const { name, value } = await sanitizeKvp(interaction, [interaction.options.getString('name'), interaction.options.getString('value')]);
        client.commands.get(`${module.exports.data.name}_${subName}`).run(interaction, name, value);
    }
    if (subName == 'get') {
        const name = await sanitizeKey(interaction, interaction.options.getString('name'));
        client.commands.get(`${module.exports.data.name}_${subName}`).run(interaction, name);
    }
}

module.exports.data = new CmdBuilder()
    .setName('config')
    .setDescription('Manage core bot configuration for this server.')
    .addSubCommand((SC) => SC
        .setName('set')
        .setDescription('Set a configuration option')
        .addStringOption((option) => option
            .setName('name')
            .setDescription('The name of the config option to change.')
            .setAutocomplete(true)
            .setRequired(true))
        .addStringOption((option) => option
            .setName('value')
            .setDescription('The new value of the config option.')
            .setAutocomplete(true)
            .setRequired(true)))
    .addSubCommand((SC) => SC
        .setName('get')
        .setDescription('Get the value of a configuration option')
        .addStringOption((option) => option
            .setName('name')
            .setDescription('The name of the config option to fetch, you can also say \'all\' to list them all.')
            .setRequired(true))
    )