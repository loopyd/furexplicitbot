const { EmbedBuilder, Colors } = require('discord.js');

// Ping kickoff for bot latency
async function kickoff(interaction) {
  const sendMessage = await new EmbedBuilder()
    .setDescription('📤 Pong...')
    .setColor(Colors.Orange);
  const sentMessage = await reply(interaction, { embeds: [sendMessage], fetchReply: true });
  return sentMessage;
}

// message for data return
function editedMessage(sentMessage, interaction) {
  const api_latency = Math.round(sentMessage.client.ws.ping);
  const body = `📥 Pong!
  Bot latency is \`${sentMessage.createdTimestamp - interaction.createdTimestamp}\`ms.
  API latency is \`${api_latency}\`ms`;
  return new EmbedBuilder()
    .setDescription(body)
    .setColor(Colors.Green);
}

// posts ping message and edits it afterwards
async function checkPing(interaction) {
  const sentReply = await kickoff(interaction);
  reply(interaction, { embeds: [editedMessage(sentReply, interaction)] });
}

module.exports.run = async (interaction) => checkPing(interaction);

module.exports.data = new CmdBuilder()
  .setName('ping')
  .setDescription('Shows API and bot latencies.');
