const axios = require('axios');

function sendHeartbeat(token, endpoint, meta, blob) {
    if (token && token.length > 0) {
        if (endpoint && endpoint.length > 0) {
            axios(blob);
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
      token = process.env.TOKEN_BOTSONDISCORD,
      meta = {
        name: "Bots On Discord list",
        node: "config.functions.heartbeat.botsondiscord.endpoint",
      },
      blob = {
        method: 'post', url: `${config.functions.heartbeat.botsondiscord.endpoint}${client.user.id}/guilds`,
        headers: {
          Authorization: process.env.TOKEN_BOTSONDISCORD,
          'Content-Type': 'application/json',
          'User-Agent': userAgent,
        },
        data: { guildCount },
      }
    );
  }, config.functions.heartbeat.botsondiscord.interval);

  // Discord bot list listing
  setInterval(() => {
    sendHeartbeat(
      token = process.env.TOKEN_DISCORDBOTLIST,
      meta = {
        name: "Discord Bot List listing",
        node: "config.functions.heartbeat.discordbotlist.endpoint",
      },
      blob = {
        method: 'post',
        url: `${config.functions.heartbeat.discordbotlist.endpoint}${client.user.id}/stats`,
        headers: {
          Authorization: process.env.TOKEN_DISCORDBOTLIST,
          'User-Agent': userAgent,
        },
        data: { guildCount },
      }
    );
  }, config.functions.heartbeat.discordbotlist.interval);

  // Discord Bots listing
  setInterval(() => {
    sendHeartbeat(
      token = process.env.TOKEN_DISCORDBOTS,
      meta = {
        name: "Discord Bots listing",
        node: "config.functions.heartbeat.discordbots.endpoint",
      },
      blob = {
        method: 'post',
        url: `${config.functions.heartbeat.discordbots.endpoint}${client.user.id}/stats`,
        headers: {
          Authorization: process.env.TOKEN_DISCORDBOTS,
          'Content-Type': 'application/json',
          'User-Agent': userAgent,
        },
        data: { guildCount },
      }
    );
  }, config.functions.heartbeat.discordbots.interval);

  // Discords listing
  setInterval(() => {
    sendHeartbeat(
      token = process.env.TOKEN_DISCORDBOTS,
      meta = {
        name: "Discords listing",
        node: "config.functions.heartbeat.discords.endpoint",
      },
      blob = {
        method: 'post',
        url: `${config.functions.heartbeat.discords.endpoint}${client.user.id}`,
        headers: {
          Authorization: process.env.TOKEN_DISCORDS,
          'User-Agent': userAgent,
        },
        data: { guildCount },
      },
    );
  }, config.functions.heartbeat.discords.interval);

  // motiondevelopment listing
  setInterval(() => {
    sendHeartbeat(
      token = process.env.TOKEN_DISCORDBOTS,
      meta = {
        name: "MotionDevelopment listing",
        node: "config.functions.heartbeat.motiondevelopment.endpoint",
      },
      blob = {
        method: 'post',
        url: `${config.functions.heartbeat.motiondevelopment.endpoint}${client.user.id}/stats`,
        headers: {
          key: process.env.TOKEN_MOTIONDEVELOPMENT,
          'Content-Type': 'application/json',
        },
        data: { guildCount },
      },
    );
  }, config.functions.heartbeat.motiondevelopment.interval);
};

module.exports.data = {
    name: 'lister',
};