'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userStatusId: DataTypes.INTEGER,
    userName: DataTypes.STRING,
    uniqueIdentifier: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    addressLine1: DataTypes.STRING,
    addressLine2: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    zipCode: DataTypes.STRING,
    gender: DataTypes.STRING,
    recommendedItems: DataTypes.STRING,
    recentlyViewedItems: DataTypes.STRING,
    creationDate: DataTypes.DATE,
    lastUpdatedDate: DataTypes.DATE,
    isActive: DataTypes.CHAR,
    isDeleted: DataTypes.CHAR
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};