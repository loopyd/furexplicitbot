// Calls all the functions that are needed for a heartbeat
module.exports.run = async () => {
  LOG(`[${module.exports.data.name}] Start sending heartbeats...`);
  // run heartbeatfunctions
  let memberFunctions = client.functions.filter((value, key, collection) => key.startsWith('HEARTBEAT_'));
  memberFunctions.forEach((value, key, collection) => {
    value.run();
  });
};

module.exports.data = {
  name: 'heartbeat',
  callOn: '-',
};
