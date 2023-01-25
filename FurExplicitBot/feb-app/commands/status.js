// TODO: Eventually also offer a App>link inside of discord to look for the source

const { EmbedBuilder, Colors } = require('discord.js');

const axios = require('axios');

const uptimeConfig = config.commands.status;

function isApiConfigured(config) {
  result =
    (config.api.endpoint && config.api.endpoint.toString().length > 0) &&
    (config.api.apiCall.services && config.api.apiCall.services.toString().length > 0) &&
    (config.api.apiCall.uptime && config.api.apiCall.uptime.toString().length > 0) &&
    (config.api.groupName && config.api.groupName.toString().length > 0);
  return result;
}

if (isApiConfigured(uptimeConfig)) {
  api = axios.create({ baseURL: uptimeConfig.api.endpoint });
}
else {
  LOG('kuma uptime API is not configured in config.json, the status command will display a remark about this.');
}

function setOverallStatus(params) {
  const { isUpOverall, embed } = params;
  // checkes if all services are true
  if (isUpOverall.every((isUp) => isUp)) {
    embed.setTitle('All Systems Operational');
    embed.setColor(Colors.Green);
  } else {
    embed.setTitle('Partially Degraded');
    embed.setColor(Colors.Orange);
  }
}

module.exports.run = async (interaction) => {
  if (!DEBUG) await interaction.deferReply({ ephemeral: false });
  const embed = new EmbedBuilder();
  if (isApiConfigured(uptimeConfig) && api) {
    // get services from uptime kuma api
    const servicesRaw = await api.get(uptimeConfig.api.apiCall.services);
    const services = servicesRaw.data.publicGroupList.find((group) => group.name === uptimeConfig.api.groupName).monitorList;
    const uptimeRaw = await api.get(uptimeConfig.api.apiCall.uptime);
    const uptime = uptimeRaw.data;
    // parse data
    const isUpOverall = [];
    const uptimeInfo = services.map((service) => {
      const id = service.id;
      const uptimePercentage = uptime.uptimeList[`${id}_24`] * 100;
      const isUp = uptime.heartbeatList[id].at(-1).status === 1;
      isUpOverall.push(isUp);
      return { name: service.name, uptimePercentage, isUp };
    });

    embed.setAuthor({ name: 'Status Page [Link]', iconURL: uptimeConfig.embed.icon, url: uptimeConfig.embed.url });
    embed.setFooter({ text: uwu('Updates every minute') });
    setOverallStatus({ isUpOverall, embed });
    // add all services to embed
    uptimeInfo.forEach((service) => embed.addFields([{ name: service.name, value: `${service.isUp ? '🟢' : '🔴'} ${Math.floor(service.uptimePercentage)}%`, inline: true }]));
  } else {
    embed.setAuthor({ name: 'Status Page', iconURL: uptimeConfig.embed.icon });
    embed.setDescription( uwu('The status command is currently disabled as my developer has not set it up, yet!') );
    embed.setFooter({ text: uwu('Disabled') });
  }
  reply(interaction, { embeds: [embed] });
};

module.exports.data = new CmdBuilder()
  .setName('status')
  .setDescription('Shows the status for all services used by the app.');
