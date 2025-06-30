"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("grn_entries", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      grn_date: { type: Sequelize.DATEONLY, allowNull: false },
      grn_time: { type: Sequelize.TIME, allowNull: false },
      grn_number: { type: Sequelize.STRING, allowNull: false, unique: true },
      supplier_name: { type: Sequelize.STRING, allowNull: false },
      manufacturer_name: { type: Sequelize.STRING, allowNull: false },
      invoice_number: { type: Sequelize.STRING },
      batch_number: { type: Sequelize.STRING },
      mfg_date: { type: Sequelize.DATEONLY },
      exp_date: { type: Sequelize.DATEONLY },
      quantity: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      unit: { type: Sequelize.ENUM("Kg", "Ltr", "Units"), defaultValue: "Kg" },
      container_count: { type: Sequelize.INTEGER },
      store_location: { type: Sequelize.STRING },
      store_rm_code: { type: Sequelize.STRING },
      qa_qc_status: {
        type: Sequelize.ENUM("PASS", "FAIL", "PENDING"),
        defaultValue: "PENDING"
      },
      remarks: { type: Sequelize.TEXT },
      guard_entry_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "guard_entries",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("grn_entries");
  }
};
