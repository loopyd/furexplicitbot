// Calls all the functions that are needed for a heartbeat
module.exports.run = async () => {
  LOG(`[${module.exports.data.name}] Start sending heartbeats...`);
  client.functions.get('HEARTBEAT_autopost').run();
  client.functions.get('HEARTBEAT_faAutopost').run();
  client.functions.get('HEARTBEAT_lister').run();
  client.functions.get('HEARTBEAT_uptime').run();
};

module.exports.data = {
  name: 'heartbeat',
  callOn: '-',
};
