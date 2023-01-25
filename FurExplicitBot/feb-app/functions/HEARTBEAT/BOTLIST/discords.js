const axios = require('axios');

function sendHeartbeat(server_count) {
  axios({
    method: 'post',
    url: `${config.functions.heartbeat.discords.endpoint}${client.user.id}`,
    headers: {
      Authorization: process.env.TOKEN_DISCORDS,
      'User-Agent': `FurExplicitBot/${config.package.version} by Phil | Flipper#3621 on Discord`,
    },
    data: { server_count },
  });
}

module.exports.run = async (guildCount) => {
  setInterval(() => {
    sendHeartbeat(guildCount);
  }, config.functions.heartbeat.discords.interval);
};

module.exports.data = {
  name: 'discords',
};
