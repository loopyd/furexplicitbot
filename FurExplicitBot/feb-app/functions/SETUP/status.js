module.exports.run = async () => {
  if (DEBUG) return;
  LOG(`[${module.exports.data.name}] Setting status...`);
  await client.user.setStatus('online');
  const guildCountsArr = await client.shard.fetchClientValues('guilds.cache.size');
  const guildCounts = guildCountsArr.reduce((previousCount, currentCount) => previousCount + currentCount, 0);
  await client.user.setActivity(`${guildCounts} servers.`, { type: 'WATCHING' });
  LOG(`[${module.exports.data.name}] Status set!`);
};

module.exports.data = {
  name: 'status',
  callOn: '-',
};
