module.exports.run = async () => {
  // setup tables
  LOG('[DB] Syncing tables...');
  await sequelize.sync();
  await LOG('[DB] Done syncing!');
};

module.exports.data = {
  name: 'DBSync',
  callOn: '-',
};
