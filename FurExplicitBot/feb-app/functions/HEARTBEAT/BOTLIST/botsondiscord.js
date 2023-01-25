const axios = require('axios');

function sendHeartbeat(guildCount) {
  if (process.env.TOKEN_BOTSONDISCORD && process.env.TOKEN_BOTSONDISCORD.length > 0) {
    axios({
      method: 'post',
      url: `${config.functions.heartbeat.botsondiscord.endpoint}${client.user.id}/guilds`,
      headers: {
        Authorization: process.env.TOKEN_BOTSONDISCORD,
        'Content-Type': 'application/json',
        'User-Agent': `FurExplicitBot/${config.package.version} by Phil | Flipper#3621 on Discord`,
      },
      data: { guildCount },
    });
  } else {
    LOG('Heartbeat skipped for Bots on Discord listing as TOKEN_BOTSONDISCORD is not set.');
  }
}

module.exports.run = async (guildCount) => {
  setInterval(() => {
    sendHeartbeat(guildCount);
  }, config.functions.heartbeat.botsondiscord.interval);
};

module.exports.data = {
  name: 'botsondiscord',
};
