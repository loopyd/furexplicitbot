const { Op } = require('sequelize');

module.exports.run = async (interaction, personalTag) => {
  const tag = interaction.options.getString('tag');

  // const highScore = personalTag.findOne({ attributes: ['score'], order: ['score', 'DESC'] });

  const out = await personalTag.findOrCreate({ where: { userID: interaction.user.id, tag }, defaults: { score: 120 } }).catch(ERR);
  if (!out[1]) personalTag.update({ score: 120 }, { where: { userID: interaction.user.id, tag } });
  messageSuccess(interaction, uwu(`ßßI'm now going to prioritize your tag ${tag}`));
};

module.exports.data = { subcommand: true };
