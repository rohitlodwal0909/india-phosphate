"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("qc_batch", "priority", {
      type: Sequelize.STRING(30),
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("qc_batch", "priority");
  }
};
