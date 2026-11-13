"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tasks", "pending_because_of", {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("tasks", "pending_because_of");
  }
};
