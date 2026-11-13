"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("grn_entries", "party_type", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Supplier"
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("grn_entries", "party_type");
  }
};
