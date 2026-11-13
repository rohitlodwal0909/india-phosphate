"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("invoices", "currency", {
      type: Sequelize.STRING(3),
      allowNull: false,
      defaultValue: "INR"
    });
    await queryInterface.addColumn("bills", "currency", {
      type: Sequelize.STRING(3),
      allowNull: false,
      defaultValue: "INR"
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("bills", "currency");
    await queryInterface.removeColumn("invoices", "currency");
  }
};
