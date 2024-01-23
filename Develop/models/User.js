const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_password: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    hours_played: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    date_joined: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // login_time: {
    //   type: DataTypes.DATE,

    // }
    },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'User',
  }
);

module.exports = User;