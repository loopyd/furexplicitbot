// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`${prefix}${cmdName} ${subcmd}\`\`\``;
}

// creates a embed messagetemplate for failed actions
function messageFail(client, message, body) {
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false);
}

module.exports.run = async (client, message, args, config, EmbedBuilder, messageOwner, fa_token_A, fa_token_B) => {
  // check DM
  if (message.channel.type === 'dm') return messageFail(client, message, 'This comamnd is for servers only.');
  const [subcmd] = args;
  const commandValues = ['add', 'remove', 'list'];
  const currentCMD = module.exports.help;
  const prefix = await client.functions.get('FUNC_getPrefix').run(message);
  if (commandValues.includes(subcmd)) {
    client.functions.get(`CMD_${currentCMD.name}_${subcmd}`)
      .run(client, message, args, config, EmbedBuilder, prefix);
  } else {
    messageFail(client, message, CommandUsage(prefix, currentCMD.name, currentCMD.usage));
  }
};

module.exports.help = {
  name: 'autosource',
  title: 'Auto-Check source',
  usage: 'add|remove|list',
  desc: 'Manage autosource channels',
};
