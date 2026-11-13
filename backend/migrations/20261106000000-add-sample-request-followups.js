"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("samplerequests", "dispatch_date", {
      type: Sequelize.DATEONLY,
      allowNull: true
    });
    await queryInterface.addColumn("samplerequests", "delivery_status", {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn("samplerequests", "expected_delivery_date", {
      type: Sequelize.DATEONLY,
      allowNull: true
    });
    await queryInterface.addColumn("samplerequests", "delivered_date", {
      type: Sequelize.DATEONLY,
      allowNull: true
    });
    await queryInterface.addColumn("samplerequests", "feedback", {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn("samplerequests", "followups", {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("samplerequests", "followups");
    await queryInterface.removeColumn("samplerequests", "feedback");
    await queryInterface.removeColumn("samplerequests", "delivered_date");
    await queryInterface.removeColumn("samplerequests", "expected_delivery_date");
    await queryInterface.removeColumn("samplerequests", "delivery_status");
    await queryInterface.removeColumn("samplerequests", "dispatch_date");
  }
};
