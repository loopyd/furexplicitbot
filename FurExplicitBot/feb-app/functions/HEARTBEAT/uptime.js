const axios = require('axios');

const params = (pingRaw) => (
  {
    msg: 'OK',
    ping: Math.round(pingRaw),
  }
);

function sendHeartbeat() {
    LOG('Sending heartbeat for uptime...')
    axios.get(`${config.functions.heartbeat.uptime.endpoint}${process.env.TOKEN_UPTIME}`, { params: params(client.ws.ping) }).catch(ERR);
}

module.exports.run = async () => {
  if (process.env.TOKEN_UPTIME && process.env.TOKEN_UPTIME.length > 0) {
    setInterval(() => {
      sendHeartbeat();
    }, config.functions.heartbeat.uptime.interval);
  } else {
    ERR('Kuma uptime disabled as TOKEN_UPTIME is not set in environment variables.');
  }
};

module.exports.data = {
  name: 'uptime',
};
