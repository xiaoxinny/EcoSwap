'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }
  Request.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tutorialbuyer: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tutorialtitle: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sellerId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'Request',
    tableName: 'requests'
  });
  return Request;
};
