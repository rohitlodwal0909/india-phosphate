"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("invoice_items", "item_category", {
      type: Sequelize.STRING(30),
      allowNull: false,
      defaultValue: "Product"
    });
    await queryInterface.addColumn("invoice_items", "master_item_id", {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn("invoice_items", "item_name", {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("invoice_items", "item_name");
    await queryInterface.removeColumn("invoice_items", "master_item_id");
    await queryInterface.removeColumn("invoice_items", "item_category");
  }
};
