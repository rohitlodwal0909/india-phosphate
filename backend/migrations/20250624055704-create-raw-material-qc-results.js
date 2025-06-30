'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('raw_material_qc_results', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rm_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Raw Material Reference ID (Foreign Key)'
      },
      test_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      result_value: {
        type: Sequelize.STRING,
        allowNull: false
      },
      
      tested_by: {
        type: Sequelize.STRING,
        allowNull: true
      },
     
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('raw_material_qc_results');
  }
};