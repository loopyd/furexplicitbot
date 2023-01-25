module.exports.run = async (interaction, personalTag) => {
  await personalTag.destroy({ where: { userID: interaction.user.id } }).catch(ERR);
  messageSuccess(interaction, uwu('Reset! You can now start fresh!'));
};

module.exports.data = { subcommand: true };
