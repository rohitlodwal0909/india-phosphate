module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("bill_items", "item_category", {
      type: Sequelize.STRING(30),
      allowNull: false,
      defaultValue: "Product"
    });
    await queryInterface.addColumn("bill_items", "master_item_id", {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn("bill_items", "item_name", {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("bill_items", "item_name");
    await queryInterface.removeColumn("bill_items", "master_item_id");
    await queryInterface.removeColumn("bill_items", "item_category");
  }
};
