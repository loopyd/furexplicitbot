module.exports.run = async (client, fs) => {
  client.user.setStatus('online');
  if (fs.existsSync('./config/test_token.json')) {
    client.user.setActivity('with the Testaccount from Flipper');
  } else {
    setInterval(() => {
      setTimeout(() => {
        client.user.setActivity(`in ${client.guilds.size} servers.`, { type: 'LISTENING' });
      }, 20000);
      client.user.setActivity('with \'+help\' command');
    }, 1 * 40000);
  }
};

module.exports.help = {
  name: 'setup_status',
};
