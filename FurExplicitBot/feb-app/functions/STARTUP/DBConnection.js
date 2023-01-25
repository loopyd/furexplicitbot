const Sequelize = require('sequelize');

module.exports.run = async () => {
  LOG('[DB] Connecting...');

  const sequelize = await new Sequelize(
    process.env.MARIADB_DATABASE,
    process.env.MARIADB_USERNAME,
    process.env.MARIADB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
      logging: DEBUG ? console.log() : DEBUG,
    },
  );
  LOG('[DB] Connected!');

  global.sequelize = sequelize;
};

module.exports.data = {
  name: 'DBConnection',
};
