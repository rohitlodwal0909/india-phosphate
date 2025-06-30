"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("guard_entries", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      inward_number: { type: Sequelize.STRING, allowNull: false, unique: true },
      entry_date: { type: Sequelize.DATEONLY, allowNull: false },
      entry_time: { type: Sequelize.TIME, allowNull: false },
      vehicle_number: { type: Sequelize.STRING, allowNull: false },
      quantity_net: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("guard_entries");
  }
};
