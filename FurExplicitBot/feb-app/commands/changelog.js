const fs = require('fs');

module.exports.run = async (interaction, force) => {
  fs.readFile(config.commands.changelog.text, 'utf8', (err, body) => {
    if (err) {
      ERR(err);
      messageFail(interaction, uwu('Something went wrong, try again another time!'));
      return;
    }
    const editBody = force ? `Hello, I have been updated!\n\n${body}` : body;
    reply(interaction, uwu(editBody));
  });
};

module.exports.data = new CmdBuilder()
  .setName('changelog')
  .setDescription('Displays information about the most recent bot changes and what\'s to come.');
