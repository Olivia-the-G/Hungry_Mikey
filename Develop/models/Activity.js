const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Activity extends Model {}

Activity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    monday: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    tuesday: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    wednesday: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    thursday: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    friday: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    saturday: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sunday: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    name_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'activity',
  }
);

module.exports = Activity;