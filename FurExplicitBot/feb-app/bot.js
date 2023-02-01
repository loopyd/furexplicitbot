// init Discord
const {
  Client, IntentsBitField, Collection, SlashCommandBuilder, Colors,
} = require('discord.js');
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


// generic file listing fetch utility with extension filter and sort capability.
global.FILES = (Directory, ext, sort, recurse) => {
  files = [];
  (infile = function(d, f) {
    fs = require('fs');
    path = require('path');
    fs.readdirSync(d).forEach((File) => {
      Absolute = path.join(d, File);
      if (fs.statSync(Absolute).isDirectory() && recurse == true) {
        infile(Absolute, f);
      } else {
        f.push(Absolute);
      }
    });
  })(Directory, files);
  if (ext != null) files = files.filter((f) => f.split('.').pop() === 'js');
  if (sort == true) files = files.sort(function (a, b) { return a.toLowerCase() > b.toLowerCase() });
  return files;
};

// creating collections and sets
client.commands = new Collection();
client.functions = new Collection();

// anouncing debug mode
if (DEBUG) LOG(`[${config.package.name}] Bot is on Debug-Mode. Some functions are not going to be loaded.`);

(async () => {
  // startup functions in order
  // const startupQueue = new PQueue({ concurrency: 1 });
  const jsfiles = await FILES('./functions/STARTUP', 'js', true);
  jsfiles.forEach(async (FCN) => {
    const INIT = require(`./${FCN}`);
    await INIT.run();
  });

  // When done: Login the bot
  await client.login(process.env.TOKEN_DISCORD);
})();

client.on('ready', async () => {
  // confirm user logged in
  LOG(`[${config.package.name}] Logged in as "${client.user.tag}"!`);

  // run setup functions
  let setupFunctions = client.functions.filter((value, key, collection) => key.startsWith('SETUP_'));
  setupFunctions.forEach((value, key, collection) => {
    value.run();
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
