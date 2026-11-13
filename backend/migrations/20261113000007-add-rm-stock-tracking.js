"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rm_issue_allocations", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      issue_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "rm_issue_records", key: "id" }, onDelete: "CASCADE" },
      grn_entry_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "grn_entries", key: "id" }, onDelete: "CASCADE" },
      quantity: { type: Sequelize.DECIMAL(12, 3), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") }
    });
    await queryInterface.addIndex("rm_issue_allocations", ["issue_id"]);
    await queryInterface.addIndex("rm_issue_allocations", ["grn_entry_id"]);
    await queryInterface.createTable("rm_production_returns", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      grn_entry_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "grn_entries", key: "id" }, onDelete: "CASCADE" },
      quantity: { type: Sequelize.DECIMAL(12, 3), allowNull: false },
      production_batch: { type: Sequelize.STRING(100), allowNull: true },
      note: { type: Sequelize.TEXT, allowNull: true },
      user_id: { type: Sequelize.INTEGER, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") }
    });
    await queryInterface.createTable("rm_warehouse_transfers", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      grn_entry_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "grn_entries", key: "id" }, onDelete: "CASCADE" },
      stock_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "stock_master", key: "stock_id" }, onDelete: "RESTRICT" },
      quantity: { type: Sequelize.DECIMAL(12, 3), allowNull: false },
      user_id: { type: Sequelize.INTEGER, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") }
    });
    await queryInterface.addIndex("rm_warehouse_transfers", ["grn_entry_id"]);
  },
  async down(queryInterface) {
    await queryInterface.dropTable("rm_warehouse_transfers");
    await queryInterface.dropTable("rm_production_returns");
    await queryInterface.dropTable("rm_issue_allocations");
  }
};
