const Path = require('path');

module.exports.run = async () => {
  // create empty array to store command submittions
  const commandsSubmit = [];
  // get all command files
  const jsfiles = await FILES('./commands/', 'js', true, true);
  const cmdLength = jsfiles.length;
  // check if commands are there
  if (cmdLength <= 0) return LOG(`[${module.exports.data.name}] No command(s) to load!`);
  // announcing command loading
  LOG(`[${module.exports.data.name}] Loading ${cmdLength} command${cmdLength !== 1 ? 's' : ''}...`);

  // adding all commands
  await jsfiles.forEach((f, i) => {
    // cleanup name
    const cleanName = f
      .replace(/\\|\//g, '_')
      .replace('commands_', '')
      .replace('.js', '');
    // abort entry if in disabled folder
    if (cleanName.search('archive_') !== -1) return;
    // get module command and info
    const probs = require(`../../${f}`);
    // announcing command loading
    LOG(`[${module.exports.data.name}]     ${i + 1}) Loaded: ${cleanName}!`);
    // adding command to collection
    client.commands.set(cleanName, probs);
    // if not subcommand: adding command to submittion to discord
    if (!probs.data.subcommand) commandsSubmit.push(probs.data.toJSON());
  });
  const registerLength = commandsSubmit.length;

  await LOG(`[${module.exports.data.name}] Loaded ${cmdLength} command${cmdLength !== 1 ? 's' : ''}!`);
  await LOG(`[${module.exports.data.name}] Registering ${registerLength} command${registerLength !== 1 ? 's' : ''}...`);
  // submit commands to discord api| Dev: one guild only, prod: globaly
  if (DEBUG) {
    const changedCommands = commandsSubmit.map((command) => {
      const newCommand = command;
      newCommand.name = `${command.name}_dev`;
      return newCommand;
    });
    await client.application.commands.set(changedCommands, process.env.devGuild).catch(ERR);
  } else await client.application.commands.set(commandsSubmit).catch(ERR);
  LOG(`[${module.exports.data.name}] ${registerLength} command${registerLength !== 1 ? 's' : ''} registered!`);
};

module.exports.data = {
  name: 'initCommands',
};
