const axios = require('axios');

function sendHeartbeat(guildCount) {
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
}

module.exports.run = async (guildCount) => {
  setInterval(() => {
    sendHeartbeat(guildCount);
  }, config.functions.heartbeat.botsondiscord.interval);
};

module.exports.data = {
  name: 'botsondiscord',
};
