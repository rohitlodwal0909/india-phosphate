"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("batch_releases", "quantity", {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("batch_releases", "quantity");
  }
};
