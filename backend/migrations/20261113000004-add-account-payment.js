"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("invoices", "received_amount", {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn("invoices", "account_payment_status", {
      type: Sequelize.ENUM("Pending", "Partially Paid", "Paid"),
      allowNull: false,
      defaultValue: "Pending"
    });
    await queryInterface.createTable("invoice_payment_followups", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      invoice_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "invoices", key: "id" },
        onDelete: "CASCADE"
      },
      note: { type: Sequelize.TEXT, allowNull: false },
      follow_up_date: { type: Sequelize.DATEONLY, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("invoice_payment_followups");
    await queryInterface.removeColumn("invoices", "account_payment_status");
    await queryInterface.removeColumn("invoices", "received_amount");
  }
};
