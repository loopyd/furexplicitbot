const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./bot.js', { token: process.env.TOKEN_DISCORD });

// manager.on('shardCreate', (shard) => console.log(`Launched shard ${shard.id}`));

manager.spawn();

manager.on('shardCreate', (shard) => {
  shard.on('spawn', () => {
    console.log(`[SHARD MGR] Launched shard ${shard.id}`);
    shard.send({ type: 'shardID', data: { shardID: shard.id } });
  });
});
