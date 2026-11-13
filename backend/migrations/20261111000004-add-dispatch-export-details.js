"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("dispatch_vehicle", "dispatch_type", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "domestic"
    });
    await queryInterface.addColumn("dispatch_vehicle", "cha", {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn("dispatch_vehicle", "inco_terms", {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn("dispatch_vehicle", "airbill", {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn("dispatch_vehicle", "bl_no", {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn("dispatch_vehicle", "destination", {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("dispatch_vehicle", "destination");
    await queryInterface.removeColumn("dispatch_vehicle", "bl_no");
    await queryInterface.removeColumn("dispatch_vehicle", "airbill");
    await queryInterface.removeColumn("dispatch_vehicle", "inco_terms");
    await queryInterface.removeColumn("dispatch_vehicle", "cha");
    await queryInterface.removeColumn("dispatch_vehicle", "dispatch_type");
  }
};
