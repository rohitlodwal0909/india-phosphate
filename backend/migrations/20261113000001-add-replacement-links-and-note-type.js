"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("replacements", "invoice_no", {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn("replacements", "work_order_id", {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn("replacements", "work_order_no", {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn("replacements", "po_source", {
      type: Sequelize.ENUM("marketing", "purchase"),
      allowNull: true
    });
    await queryInterface.addColumn("replacements", "marketing_po_id", {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn("replacements", "purchase_po_id", {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn("replacements", "dispatch_id", {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn("replacements", "note_type", {
      type: Sequelize.ENUM("debit", "credit"),
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("replacements", "note_type");
    await queryInterface.removeColumn("replacements", "dispatch_id");
    await queryInterface.removeColumn("replacements", "purchase_po_id");
    await queryInterface.removeColumn("replacements", "marketing_po_id");
    await queryInterface.removeColumn("replacements", "po_source");
    await queryInterface.removeColumn("replacements", "work_order_no");
    await queryInterface.removeColumn("replacements", "work_order_id");
    await queryInterface.changeColumn("replacements", "invoice_no", {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
