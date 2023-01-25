// init Discord
const {
  Client, IntentsBitField, Collection, SlashCommandBuilder, Colors,
} = require('discord.js');
// init file system
const fs = require('fs');
// use contructor to create intent bit field
const intents = new IntentsBitField([
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMessages,
]);
// init Discord client
global.client = new Client({ allowedMentions: { parse: ['users', 'roles'], repliedUser: true }, intents });
// init config
global.config = require('./config.json');
global.config.package = require('./package.json');

global.DEBUG = process.env.NODE_ENV === 'development';

global.CmdBuilder = SlashCommandBuilder;

global.currentShardID = -1;

global.LOG = (msg) => console.log(`[${currentShardID}]${msg}`);

global.ERR = (err) => {
  console.error(`[${currentShardID}] ERROR:`, err);
  return;
  // eslint-disable-next-line no-unreachable
  if (DEBUG) return;
  const { EmbedBuilder } = require('discord.js');
  const embed = new EmbedBuilder()
    .setAuthor({ name: `[${currentShardID}] Error: '${err.message}'` })
    .setDescription(`STACKTRACE:\n\`\`\`${err.stack.slice(0, 4000)}\`\`\``)
    .setColor(Colors.Red);
  client.channels.cache.get(config.logChannel).send({ embeds: [embed] });
  return;
};

// creating collections and sets
client.commands = new Collection();
client.functions = new Collection();

// anouncing debug mode
if (DEBUG) LOG(`[${config.package.name}] Bot is on Debug-Mode. Some functions are not going to be loaded.`);

(async () => {
  // startup functions in order
  // const startupQueue = new PQueue({ concurrency: 1 });
  const files = await fs.readdirSync('./functions/STARTUP');
  files.forEach(async (FCN) => {
    if (!FCN.endsWith('.js')) return;
    const INIT = require(`./functions/STARTUP/${FCN}`);
    await INIT.run(fs);
    // startupQueue.add(async () => {
    //   if (!FCN.endsWith('.js')) return;
    //   const INIT = require(`./functions/STARTUP/${FCN}`);
    //   await INIT.run(fs);
    // });
  });

  // When done: Login the bot
  await client.login(process.env.TOKEN_DISCORD);
})();

client.on('ready', async () => {
  // confirm user logged in
  LOG(`[${config.package.name}] Logged in as "${client.user.tag}"!`);

  // run setup functions
  config.setup.setupFunctions.forEach((FCN) => {
    client.functions.get(FCN).run();
  });
});

// // trigger on guildDelete
client.on('guildDelete', (guild) => client.functions.get('EVENT_guildDelete').run(guild));

// trigger on channelDeletion
client.on('channelDelete', (channel) => client.functions.get('EVENT_channelDelete').run(channel));

// itneraction is triggered (command, autocomplete, etc.)
client.on('interactionCreate', (interaction) => client.functions.get('EVENT_interactionCreate').run(interaction));

// logging errors and warns
client.on('error', (ERR));
client.on('warn', (ERR));
process.on('uncaughtException', (ERR));

process.on('message', (message) => {
  switch (message.type) {
    case 'shardID':
      currentShardID = message.data.shardID;
      return true;
    default: return false;
  }
});
