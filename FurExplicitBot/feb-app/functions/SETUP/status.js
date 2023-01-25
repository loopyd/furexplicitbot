module.exports.run = async () => {
  // FIXME: function loads in when shards are not ready yet, causing a error on startup and no status
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
