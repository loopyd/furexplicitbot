const axios = require('axios');

function sendHeartbeat(guilds) {
  axios({
    method: 'post',
    url: `${config.functions.heartbeat.discordbotlist.endpoint}${client.user.id}/stats`,
    headers: {
      Authorization: process.env.TOKEN_DISCORDBOTLIST,
      'User-Agent': `FurExplicitBot/${config.package.version} by Phil | Flipper#3621 on Discord`,
    },
    data: { guilds },
  });
}

module.exports.run = async (guildCount) => {
  setInterval(() => {
    sendHeartbeat(guildCount);
  }, config.functions.heartbeat.discordbotlist.interval);
};

module.exports.data = {
  name: 'discordbotlist',
};
