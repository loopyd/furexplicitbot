const axios = require('axios');

function sendHeartbeat(guildCount) {
  if (process.env.TOKEN_DISCORDBOTS && process.env.TOKEN_DISCORDBOTS.length > 0) {
    axios({
      method: 'post',
      url: `${config.functions.heartbeat.discordbots.endpoint}${client.user.id}/stats`,
      headers: {
        Authorization: process.env.TOKEN_DISCORDBOTS,
        'Content-Type': 'application/json',
        'User-Agent': `FurExplicitBot/${config.package.version} by Phil | Flipper#3621 on Discord`,
      },
      data: { guildCount },
    });
  } else {
    LOG('Heartbeat skipped for DiscordBots as TOKEN_DISCORDBOTS is not set.');
  }
}

module.exports.run = async (guildCount) => {
  setInterval(() => {
    sendHeartbeat(guildCount);
  }, config.functions.heartbeat.discordbots.interval);
};

module.exports.data = {
  name: 'disordbots',
};
