import { DataTypes } from 'sequelize';

export function main(sequelize) {
  return sequelize.define(
    'postfacache',
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
      submissionID: {
        type: DataTypes.INTEGER(20),
        allowNull: false,
      },
    },
    {
      uniqueKeys: {
        autoPostUnique: {
          fields: ['channelID', 'submissionID'],
        },
      },
    }
  );
}



