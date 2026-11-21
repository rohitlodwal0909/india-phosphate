module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("qadocumentscoas", "marketing_review", {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("qadocumentscoas", "marketing_review");
  }
};
