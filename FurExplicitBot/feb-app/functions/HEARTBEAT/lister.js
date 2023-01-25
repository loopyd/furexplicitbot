const axios = require('axios');

function sendHeartbeat(meta, blob) {
  if (meta.token && meta.token.length > 0) {
    if (meta.endpoint && meta.endpoint.length > 0) {
      try {
        LOG(`Sending heartbeat for ${meta.name}...`)
        axios(blob)
        LOG(`Sent heartbeat for ${meta.name} successfully.`)
      } catch (error) {
        ERR(`Error sending heartbeat for ${meta.name}, error was: ${error}`);
      };
    } else {
      LOG(`Heartbeat skipped for ${meta.name} as ${meta.node} is not set in config.json.`);
    }
  } else {
    LOG(`Heartbeat skipped for ${meta.name} as ${meta.token} is not set in config.json.`);
  }
}

module.exports.run = async () => {
  const guildCountsArr = await client.shard.fetchClientValues('guilds.cache.size');
  const guildCount = guildCountsArr.reduce((previousCount, currentCount) => previousCount + currentCount, 0);
  const userAgent = `${config.package.name}/${config.package.version} by ${config.package.author}`

  // Bots on Discord listing
  setInterval(() => {
    sendHeartbeat(
      {
        'name': "Bots On Discord list",
        'node': "config.functions.heartbeat.botsondiscord.endpoint",
        'token': process.env.TOKEN_BOTSONDISCORD,
        'endpoint': config.functions.heartbeat.botsondiscord.endpoint,
      },
      {
        'method': 'post',
        'url': `${config.functions.heartbeat.botsondiscord.endpoint}${client.user.id}/guilds`,
        'headers': {
          'Authorization': process.env.TOKEN_BOTSONDISCORD,
          'Content-Type': 'application/json',
          'User-Agent': userAgent,
        },
        'data': { guildCount },
      });
  }, config.functions.heartbeat.botsondiscord.interval);

  // Discord bot list listing
  setInterval(() => {
    sendHeartbeat(
      {
        'name': "Discord Bot List listing",
        'node': "config.functions.heartbeat.discordbotlist.endpoint",
        'token': process.env.TOKEN_DISCORDBOTLIST,
        'endpoint': config.functions.heartbeat.discordbotlist.endpoint,
      },
      {
        'method': 'post',
        'url': `${config.functions.heartbeat.discordbotlist.endpoint}${client.user.id}/stats`,
        'headers': {
          'Authorization': process.env.TOKEN_DISCORDBOTLIST,
          'User-Agent': userAgent,
        },
        'data': { guildCount },
      }
    );
  }, config.functions.heartbeat.discordbotlist.interval);

  // Discord Bots listing
  setInterval(() => {
    sendHeartbeat(
      {
        'name': "Discord Bots listing",
        'node': "config.functions.heartbeat.discordbots.endpoint",
        'token': process.env.TOKEN_DISCORDBOTS,
        'endpoint': config.functions.heartbeat.discordbotlist.endpoint,
      },
      {
        'method': 'post',
        'url': `${config.functions.heartbeat.discordbots.endpoint}${client.user.id}/stats`,
        'headers': {
          'Authorization': process.env.TOKEN_DISCORDBOTS,
          'Content-Type': 'application/json',
          'User-Agent': userAgent,
        },
        'data': { guildCount },
      }
    );
  }, config.functions.heartbeat.discordbots.interval);

  // Discords listing
  setInterval(() => {
    sendHeartbeat(
      {
        'name': "Discords listing",
        'node': "config.functions.heartbeat.discords.endpoint",
        'token': process.env.TOKEN_DISCORDS,
        'endpoint': config.functions.heartbeat.discords.endpoint,
      },
      {
        'method': 'post',
        'url': `${config.functions.heartbeat.discords.endpoint}${client.user.id}`,
        'headers': {
          'Authorization': process.env.TOKEN_DISCORDS,
          'User-Agent': userAgent,
        },
        'data': { guildCount },
      },
    );
  }, config.functions.heartbeat.discords.interval);

  // motiondevelopment listing
  setInterval(() => {
    sendHeartbeat(
      {
        'name': "Motion Development listing",
        'node': "config.functions.heartbeat.motiondevelopment.endpoint",
        'token': process.env.TOKEN_MOTIONDEVELOPMENT,
        'endpoint': config.functions.heartbeat.motiondevelopment.endpoint,
      },
      {
        'method': 'post',
        'url': `${config.functions.heartbeat.motiondevelopment.endpoint}${client.user.id}/stats`,
        'headers': {
          'key': process.env.TOKEN_MOTIONDEVELOPMENT,
          'Content-Type': 'application/json',
        },
        'data': { guildCount },
      },
    );
  }, config.functions.heartbeat.motiondevelopment.interval);
};

module.exports.data = {
    name: 'lister',
};