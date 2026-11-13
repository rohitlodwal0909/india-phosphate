"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("production_plannings", "target", {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn("production_plannings", "name_of_person", {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("production_plannings", "name_of_person");
    await queryInterface.removeColumn("production_plannings", "target");
  }
};
