const axios = require('axios');

function sendHeartbeat(guilds) {
  if (process.env.TOKEN_MOTIONDEVELOPMENT && process.env.TOKEN_MOTIONDEVELOPMENT.length > 0) {
    axios({
      method: 'post',
      url: `${config.functions.heartbeat.motiondevelopment.endpoint}${client.user.id}/stats`,
      headers: {
        key: process.env.TOKEN_MOTIONDEVELOPMENT,
        'Content-Type': 'application/json',
      },
      data: { guilds },
    });
  } else {
    LOG('Heartbeat skipped for Discords Listing as TOKEN_DISCORDS is not set.');
  }
}

module.exports.run = async (guildCount) => {
  setInterval(() => {
    sendHeartbeat(guildCount);
  }, config.functions.heartbeat.motiondevelopment.interval);
};

module.exports.data = {
  name: 'motiondevelopment',
};
