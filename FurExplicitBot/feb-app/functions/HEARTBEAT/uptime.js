const axios = require('axios');

const params = (pingRaw) => (
  {
    msg: 'OK',
    ping: Math.round(pingRaw),
  }
);

function sendHeartbeat() {
  if (process.env.TOKEN_UPTIME && process.env.TOKEN_UPTIME.length > 0) {
    axios.get(`${config.functions.heartbeat.uptime.endpoint}${process.env.TOKEN_UPTIME}`, { params: params(client.ws.ping) });
  } else {
    LOG('Heartbeat skipped for uptime as TOKEN_UPTIME is not set.');
  }
}

module.exports.run = async () => {
  setInterval(() => {
    sendHeartbeat();
  }, config.functions.heartbeat.uptime.interval);
};

module.exports.data = {
  name: 'uptime',
};
