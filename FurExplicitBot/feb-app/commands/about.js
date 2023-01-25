const { EmbedBuilder, Colors } = require('discord.js');

const fs = require('fs');

module.exports.run = async (interaction) => {
  fs.readFile(config.commands.about.text, 'utf8', (err, content) => {
    if (err) {
      LOG(err);
      messageFail(interaction, uwu('Oh, no! Something went wrong. Sorry about that :('));
      return;
    }
    const embed = new EmbedBuilder();
    embed.setDescription(uwu(content))
      .setColor(Colors.Orange)
      .setTitle('About')
      .setThumbnail(config.commands.about.logo);
    reply(interaction, { embeds: [embed] });
    // messageSuccess(interaction, uwu(content), 'Orange', true);
  });
};

module.exports.data = new CmdBuilder()
  .setName('about')
  .setDescription('Learn more about me!');
