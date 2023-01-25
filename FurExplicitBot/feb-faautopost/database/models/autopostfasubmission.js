import { DataTypes } from 'sequelize';

export function main(sequelize) {
  return sequelize.define(
    'autopostfasubmission',
    {
      ID: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
      },
      channelID: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      serverID: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      artistID: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false,
      },
    },
  );
}
