'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      userStatusId: {
        type: Sequelize.INTEGER
      },
      userName: {
        type: Sequelize.STRING
      },
      uniqueIdentifier: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      addressLine1: {
        type: Sequelize.STRING
      },
      addressLine2: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      zipCode: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      recommendedItems: {
        type: Sequelize.STRING
      },
      recentlyViewedItems: {
        type: Sequelize.STRING
      },
      creationDate: {
        type: Sequelize.DATE
      },
      lastUpdatedDate: {
        type: Sequelize.DATE
      },
      isActive: {
        type: Sequelize.CHAR
      },
      isDeleted: {
        type: Sequelize.CHAR
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};